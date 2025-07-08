import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { MdAdd, MdNotifications } from "react-icons/md";
import axios from "../../../../../api/axios";
import { CLIENT_REMINDER_CONFIG_URL } from "../../../../../api/api_routing_urls";
import HeadingAndButton from "../../../../../reusable-components/HeadingAndButton";
import DeleteModal from "../../../../../reusable-components/modals/DeleteModal";
import showToast from "../../../../../utilities/notification/NotificationModal";
import Spinner from "../../../../../reusable-components/spinner/spinner.component";
import ClientReminderNotifications from "./ClientReminderNotifications";


//filters for all,active,hold list of clients and services
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Hold", value: "hold" },
];


const ClientReminderList = ({ setCurrentPage, setEditReminderDetails }) => {
  const location = useLocation();
  const defaultFilter = location.state?.filter || "all";

  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [upcomingExpiries, setUpcomingExpiries] = useState([]);
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getReminderList();
  }, []);

  // Fetch reminder list
  const getReminderList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(CLIENT_REMINDER_CONFIG_URL);
      const responseData =
        response?.data?.data ||
        response?.data?.clientReminderList ||
        response?.data ||
        [];
      const safeData = Array.isArray(responseData) ? responseData : [];
      setReminders(safeData);

      // Check for upcoming expiries
      const currentDate = new Date();
      const thirtyDaysFromNow = new Date(currentDate);
      thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

      const upcoming = safeData.filter(reminder => {
        const expiryDate = new Date(reminder.reminder_type_expiry_date);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= currentDate;
      });
      setUpcomingExpiries(upcoming);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      showToast("Error loading reminders. Please try again later.", "error");
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit 
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

  // Delete reminder
  const onClickDelete = async () => {
    try {
      if (!reminderToDelete || !reminderToDelete.reminder_details_id) {
        showToast("Invalid reminder selection", "error");
        return;
      }
      const deletePayload = { reminder_details_id: reminderToDelete.reminder_details_id };
      const response = await axios.post(`${CLIENT_REMINDER_CONFIG_URL}/delete`, deletePayload);
      if (response.status === 200) {
        showToast("Reminder deleted successfully", "success");
        await getReminderList();
        setShowDelete(false);
      } else {
        showToast("Failed to delete reminder", "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      const errorMessage = error.response?.data?.message || "Deletion failed";
      showToast(errorMessage, "error");
    }
  };

  // Confirm delete action
  const confirmDelete = (reminder) => {
    if (!reminder || !reminder.reminder_details_id) {
      showToast("Invalid reminder ID", "error");
      return;
    }
    setReminderToDelete(reminder);
    setTimeout(() => setShowDelete(true), 100);
  };

  // Filtered and searched reminders
  const filteredReminders = reminders.filter(reminder => {
    // Status filter
    if (statusFilter !== "all" && reminder.status !== statusFilter) return false;
    // Search filter
    if (searchTerm.trim() === "") return true;
    const search = searchTerm.toLowerCase();
    return (
      (reminder.client_name && reminder.client_name.toLowerCase().includes(search)) ||
      (reminder.reminder_type_name && reminder.reminder_type_name.toLowerCase().includes(search))
    );
  });

 
  const renderView = () => {
    switch (activeView) {
      case 'notifications':
        return (
          <ClientReminderNotifications
            upcomingExpiries={upcomingExpiries}
            setCurrentPage={setCurrentPage}
            setActiveView={setActiveView}

            setEditReminderDetails={setEditReminderDetails}
          />
        );
      case 'list':
      default:
        return (
          <section className="py-8 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Client Reminders</h2>
              <div className="flex items-center space-x-4">
                <HeadingAndButton
                  title=""
                  buttonText="Add Reminder"
                  buttonIcon={MdAdd}
                  onButtonClick={() => {
                    setCurrentPage("add");
                    setEditReminderDetails({});
                  }}
                />
                <HeadingAndButton
                  title=""
                  buttonText={`Notifications ${upcomingExpiries.length > 0 ? `(${upcomingExpiries.length})` : ''}`}
                  buttonIcon={MdNotifications}
                  onButtonClick={() => setActiveView('notifications')}
                  className={upcomingExpiries.length > 0 ? "text-red-500" : ""}
                />
              </div>
            </div>

            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <input
                type="text"
                className="border px-3 py-2 rounded w-full md:w-1/3"
                placeholder="Search by client or reminder type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2 mt-2 md:mt-0">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    className={`px-3 py-1 rounded border text-sm font-medium
                      ${statusFilter === f.value ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}
                      hover:bg-blue-100`}
                    onClick={() => setStatusFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="text-center">
                  <Spinner />
                  <p className="mt-2 text-gray-600">Loading reminders...</p>
                </div>
              ) : (
                <table className="w-full border">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="pl-4 py-2 w-[5%] text-start">Sl. No.</th>
                      <th className="text-start">Client</th>
                      <th className="text-start">Reminder Type</th>
                      <th className="text-start">Expiry Date</th>
                      <th className="text-start">Admin Remarks</th>
                      <th className="text-start">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReminders.length > 0 ? (
                      filteredReminders.map((reminder, index) => (
                        <tr
                          key={reminder.reminder_details_id}
                          className={`${index % 2 === 0 ? "bg-slate-50" : "bg-slate-100"} 
                            ${upcomingExpiries.includes(reminder) ? "border-l-4 border-red-500" : ""}`}
                        >
                          <td className="pl-4 py-4">{index + 1}</td>
                          <td>{reminder.client_name}</td>
                          <td>{reminder.reminder_type_name}</td>
                          <td>{new Date(reminder.reminder_type_expiry_date).toLocaleDateString()}</td>
                          <td>{reminder.admin_remarks || "-"}</td>
                          <td>{reminder.status}</td>
                          <td className="flex gap-x-4 items-center justify-center py-4">
                            <FiEdit2
                              color="green"
                              size={14}
                              onClick={() => handleEdit(reminder)}
                              className="cursor-pointer"
                            />
                            <BsTrash3
                              color="red"
                              size={16}
                              onClick={() => confirmDelete(reminder)}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center text-sm font-semibold">
                        <td colSpan="7" className="py-4">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

           
            <DeleteModal
              open={showDelete}
              setOpen={setShowDelete}
              message="This reminder will be deleted permanently. Are you sure?"
              onDelete={onClickDelete}
            />
          </section>
        );
    }
  };

  return renderView();
};

export default ClientReminderList;
