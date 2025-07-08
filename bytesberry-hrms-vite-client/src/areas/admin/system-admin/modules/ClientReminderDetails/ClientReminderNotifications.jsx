import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdNotifications, MdArrowBack } from 'react-icons/md';
import axios from '../../../../../api/axios';
import {
  CLIENT_REMINDER_CONFIG_URL,
  SEND_REMINDER_NOTIFICATION_URL
} from '../../../../../api/api_routing_urls';
import showToast from "../../../../../utilities/notification/NotificationModal";
import Spinner from "../../../../../reusable-components/spinner/spinner.component";

const ClientReminderNotifications = ({
  setActiveView,
  setCurrentPage,
  setEditReminderDetails,
  onlyAllTab = false,
}) => {
  const [upcomingExpiries, setUpcomingExpiries] = useState([]);
  const [resolvedReminders, setResolvedReminders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const emailSentRef = useRef(false);

  useEffect(() => {
    fetchReminders();
    
  }, [filter]);
//to show all tabs only in dashboard notification button
  useEffect(() => {
    if (onlyAllTab) setFilter('all');
  }, [onlyAllTab]);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(CLIENT_REMINDER_CONFIG_URL);
      const responseData = response?.data?.data || response?.data?.clientReminderList || response?.data || [];
      const safeData = Array.isArray(responseData) ? responseData : [];

      const currentDate = new Date();
      const thirtyDaysFromNow = new Date(currentDate);
      thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

      const upcomingReminders = safeData.filter(reminder => {
        const expiryDate = new Date(reminder.reminder_type_expiry_date);
        return (
          reminder.status === 'active' &&
          expiryDate <= thirtyDaysFromNow &&
          expiryDate >= currentDate
        );
      });

      const resolved = safeData.filter(
        reminder => reminder.is_addressed === true && reminder.status === 'active'
      );

      const unresolved = safeData.filter(reminder => {
        const expiryDate = new Date(reminder.reminder_type_expiry_date);
        return (
          reminder.is_addressed === false &&
          reminder.status === 'active' &&
          expiryDate <= thirtyDaysFromNow
        );
      });

      setUpcomingExpiries(unresolved);
      setResolvedReminders(resolved);

      // expired and pending
      const expired = unresolved.filter(r => getDaysUntilExpiry(r.reminder_type_expiry_date) < 0);
      const pending = unresolved.filter(r => getDaysUntilExpiry(r.reminder_type_expiry_date) >= 0);

      // Send email 
      if (!emailSentRef.current) {
        await sendEmailNotification(pending, "Pending");
        await sendEmailNotification(expired, "Expired");
        emailSentRef.current = true;
      }

    } catch (error) {
      console.error("Error fetching reminders:", error);
      showToast("Error loading reminders. Please try again later.", "error");
      setUpcomingExpiries([]);
      setResolvedReminders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
//send email to the admin
  const sendEmailNotification = async (reminders, type) => {
    if (!reminders.length) return;

    const recipients = [
      "bibekgope6321@gmail.com"
    ];

    const subject = `Reminder Notification - ${type} Reminders`;
    const html = `
      <h3>${type} Reminders</h3>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Client</th>
            <th>Reminder Type</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Admin Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${reminders.map(r => `
            <tr>
              <td>${r.client_name}</td>
              <td>${r.reminder_type_name}</td>
              <td>${new Date(r.reminder_type_expiry_date).toLocaleDateString()}</td>
              <td>${getDaysUntilExpiry(r.reminder_type_expiry_date)}</td>
              <td>${r.admin_remarks || '-'}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    try {
      await axios.post(SEND_REMINDER_NOTIFICATION_URL, {
        to: recipients.join(","),
        subject,
        html
      });
      console.log(`${type} email sent successfully`);
    } catch (err) {
      console.error(`Failed to send ${type} email:`, err);
    }
  };

  const handleEdit = (reminder) => {
    const formattedReminder = {
      ...reminder,
      reminder_type_expiry_date: reminder.reminder_type_expiry_date ?
        new Date(reminder.reminder_type_expiry_date).toISOString().split('T')[0] : '',
      reminder_type_renewal_date: reminder.reminder_type_renewal_date ?
        new Date(reminder.reminder_type_renewal_date).toISOString().split('T')[0] : ''
    };

    setEditReminderDetails(formattedReminder);
    setCurrentPage("edit");
  };

  
  const getFilteredReminders = () => {
    if (onlyAllTab) return [...upcomingExpiries, ...resolvedReminders];
    switch (filter) {
      case 'all':
        return [...upcomingExpiries, ...resolvedReminders];
      case 'unresolved':
        return upcomingExpiries;
      case 'resolved':
        return resolvedReminders;
      default:
        return [...upcomingExpiries, ...resolvedReminders];
    }
  };

  const renderFilterButtons = () => {
    const filters = [
      { key: 'all', label: 'All', count: upcomingExpiries.length + resolvedReminders.length },
      { key: 'unresolved', label: 'Unresolved', count: upcomingExpiries.length },
      { key: 'resolved', label: 'Resolved', count: resolvedReminders.length }
    ];

    return (
      <div className="flex items-center space-x-4 mb-4">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${filter === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    );
  };

  const filteredReminders = getFilteredReminders();

  return (
    <section className="py-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <MdArrowBack
            size={24}
            onClick={() => setActiveView('list')}
            className="cursor-pointer text-gray-700 hover:text-gray-900"
          />
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <MdNotifications className="mr-2" />
            All Notifications
          </h2>
        </div>
      </div>

      {/* Only show filter buttons if not onlyAllTab */}
      {!onlyAllTab && renderFilterButtons()}

      <div className="mt-10">
        {isLoading ? (
          <div className="text-center">
            <Spinner />
            <p className="mt-2 text-gray-600">Loading reminders...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-xl">
              No reminders found.
            </p>
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="pl-4 py-2 text-start w-[5%]">Sl. No.</th>
                <th className="text-start">Client</th>
                <th className="text-start">Reminder Type</th>
                <th className="text-start">Expiry Date</th>
                <th className="text-start">Days Left</th>
                <th className="text-start">Admin Remarks</th>
                <th className="text-start">State</th>
                {filter === 'unresolved' && (
                  <th className="text-start">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map((reminder, index) => (
                <tr key={`${reminder.reminder_details_id}-${index}`} className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'}`}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{reminder.client_name}</td>
                  <td className="px-4 py-2">{reminder.reminder_type_name}</td>
                  <td className="px-4 py-2">{new Date(reminder.reminder_type_expiry_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{getDaysUntilExpiry(reminder.reminder_type_expiry_date)} Days</td>
                  <td className="px-4 py-2">{reminder.admin_remarks}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${reminder.is_addressed
                      ? 'bg-green-100 text-green-800'
                      : getDaysUntilExpiry(reminder.reminder_type_expiry_date) < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {reminder.is_addressed
                        ? 'Resolved'
                        : getDaysUntilExpiry(reminder.reminder_type_expiry_date) < 0
                          ? 'Expired'
                          : 'Pending'}
                    </span>
                  </td>
                  {filter === 'unresolved' && (
                    <td className="px-4 py-2 text-center">
                      {!reminder.is_addressed && (
                        <FiEdit2
                          color="green"
                          size={16}
                          onClick={() => handleEdit(reminder)}
                          className="cursor-pointer inline-block"
                          title="Edit Reminder"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ClientReminderNotifications;
