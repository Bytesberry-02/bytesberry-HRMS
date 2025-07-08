import React, { useEffect, useState } from "react";
import Dashboard from "../common/dashboard-components/dashboard.component";
import axios from "../../../api/axios";
import {
  CLIENT_REMINDER_CONFIG_URL,
  MASTER_CLIENT_CONFIG_URL,
  MASTER_REMINDER_TYPE_CONFIG_URL,
} from "../../../api/api_routing_urls";
import ClientReminderNotifications from "./modules/ClientReminderDetails/ClientReminderNotifications";
import { MdNotifications } from "react-icons/md";

export default function SystemAdminDashboard({ setCurrentPage }) {
  const [masterReminderTypes, setMasterReminderTypes] = useState([]);
  const [clientReminders, setClientReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [upcomingExpiries, setUpcomingExpiries] = useState([]);
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reminderTypeRes, clientReminderRes, clientRes] = await Promise.all([
        axios.get(MASTER_REMINDER_TYPE_CONFIG_URL),
        axios.get(CLIENT_REMINDER_CONFIG_URL),
        axios.get(MASTER_CLIENT_CONFIG_URL),
      ]);

      const reminderTypeList = reminderTypeRes?.data?.mstReminderTypeList || [];
      const clientReminderList =
        clientReminderRes?.data?.clientReminderList ||
        clientReminderRes?.data?.data ||
        [];
      const clientList = clientRes?.data?.mstClientList || [];

      setMasterReminderTypes(Array.isArray(reminderTypeList) ? reminderTypeList : []);
      setClientReminders(Array.isArray(clientReminderList) ? clientReminderList : []);
      setClients(Array.isArray(clientList) ? clientList : []);

      const currentDate = new Date();
      const thirtyDaysFromNow = new Date(currentDate);
      thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

      const upcoming = clientReminderList.filter((r) => {
        const expiry = new Date(r.reminder_type_expiry_date);
        return (
          r.status === "active" &&
          expiry >= currentDate &&
          expiry <= thirtyDaysFromNow &&
          !r.is_addressed
        );
      });

      setNotificationCount(upcoming.length);
      setUpcomingExpiries(upcoming);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setMasterReminderTypes([]);
      setClientReminders([]);
      setClients([]);
      setUpcomingExpiries([]);
    }
  };

  const getCountByStatus = (status) =>
    clientReminders.filter((r) => r.status === status).length;

  const SummaryCard = ({ title, count, icon: Icon, onClick, clickable = false }) => (
    <div
      className={`p-6 rounded-xl shadow-md text-center border ${
        clickable ? "cursor-pointer hover:shadow-lg transition-all" : ""
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="text-xl font-semibold text-gray-700 mb-2">{title}</div>
      <div className="text-3xl font-bold text-[#124277] flex justify-center items-center gap-2">
        {Icon && <Icon />}
        {count}
      </div>
    </div>
  );

 
  const renderView = () => {
    switch (activeView) {
      case "notifications":
        return (
          <ClientReminderNotifications
            setActiveView={setActiveView}
            onlyAllTab={true}//only the all tab 
            allReminders={clientReminders}
          />
        );
      case "list":
      default:
        return (
          <section className="p-4">
            <h1 className="text-3xl font-semibold text-[#124277] mb-6 text-center">
              Welcome System Admin!
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Total Reminder Types" count={masterReminderTypes.length} />
              <SummaryCard title="Total Clients" count={clients.length} />
              <SummaryCard title="Active Clients" count={getCountByStatus("active")} />
              <SummaryCard title="Hold Clients" count={getCountByStatus("hold")} />
              <SummaryCard
                title="Notifications"
                count={notificationCount}
                icon={MdNotifications}
                onClick={() => setActiveView("notifications")}
                clickable
              />
            </div>
          </section>
        );
    }
  };

 
  return <Dashboard>{renderView()}</Dashboard>;
}
