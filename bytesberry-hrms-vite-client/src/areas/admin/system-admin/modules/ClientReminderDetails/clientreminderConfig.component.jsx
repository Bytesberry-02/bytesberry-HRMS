/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import axios from "../../../../../api/axios";
import { CLIENT_REMINDER_CONFIG_URL } from "../../../../../api/api_routing_urls";

import showToast from "../../../../../utilities/notification/NotificationModal";

import Dashboard from "../../../common/dashboard-components/dashboard.component";
import ClientReminderList from "./clientreminderList.component";
import ClientReminderForm from "./addClientReminderForm.component";
import ClientReminderNotifications from "./ClientReminderNotifications"; 

const ClientReminderConfig = () => {
  const [currentPage, setCurrentPage] = useState("list"); 
  const [editReminderDetails, setEditReminderDetails] = useState({});
  const [reminderList, setReminderList] = useState([]);

  const getReminderList = async () => {
    try {
      const response = await axios.get(CLIENT_REMINDER_CONFIG_URL);
      if (response.status === 200) {
        setReminderList(response?.data?.reminderList || []);
      } else if (response.status === 202) {
        showToast("No reminders found in the system.", "error");
        setReminderList([]);
      }
    } catch (error) {
      console.error("getReminderList", error);
      if (!error?.response) {
        showToast("No Server Response", "error");
      } else if (error.response.status === 422) {
        showToast("Some required inputs were not provided.", "error");
      } else {
        showToast("An error occurred. Please contact the administrator.", "error");
      }
    }
  };

  useEffect(() => {
    getReminderList();
    setEditReminderDetails({});
  }, []);

  return (
    <section>
      <Dashboard sidebarType="System Admin">
        {currentPage === "list" && (
          <ClientReminderList
            setCurrentPage={setCurrentPage}
            getReminderList={getReminderList}
            reminderList={reminderList}
            setEditReminderDetails={setEditReminderDetails}
          />
        )}

        {currentPage === "notifications" && (
          <ClientReminderNotifications
            setCurrentPage={setCurrentPage}
            setEditReminderDetails={setEditReminderDetails}
          />
        )}
        {
          currentPage === "dashboard" && (
            <SystemAdminDashboard setCurrentPage={setCurrentPage} />
          )
        }

        {(currentPage === "form" || currentPage === "edit" || currentPage === "add") && (
          <ClientReminderForm
            setCurrentPage={setCurrentPage}
            getReminderList={getReminderList}
            editReminderDetails={editReminderDetails}
          />
        )}
      </Dashboard>
    </section>
  );
};

export default ClientReminderConfig;
