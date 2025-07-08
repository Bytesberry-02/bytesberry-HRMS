/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import axios from "../../../../../api/axios";
import { MASTER_REMINDER_TYPE_CONFIG_URL } from "../../../../../api/api_routing_urls";

import showToast from "../../../../../utilities/notification/NotificationModal";

import Dashboard from "../../../common/dashboard-components/dashboard.component";

import AddReminderTypeForm from "./addReminderTypeForm.component";
import ReminderTypeList from "./ReminderTypeList.component";

const ReminderTypeConfig = () => {
  const [currentPage, setCurrentPage] = useState(true);
  const [editReminderTypeDetails, setEditReminderTypeDetails] = useState({});
  const [remindertypeList, setReminderTypeList] = useState([]);

  const getReminderTypeList = async () => {
    try {
      const response = await axios.get(MASTER_REMINDER_TYPE_CONFIG_URL);
      //console.log("API Response:", response.data); // Debugging API response

      if (response.status === 200 && response.data?.mstReminderTypeList) {
        setReminderTypeList([...response.data.mstReminderTypeList]);
        //console.log("Updated Reminder List:", response.data.mstReminderTypeList);
      } else if (response.status === 202) {
        showToast("No reminder types found.", "error");
        setReminderTypeList([]); // Ensure an empty array if no data is found
      }
    } catch (error) {
      console.error("Error fetching reminder types:", error);
      showToast("Error fetching data. Contact admin.", "error");
    }
  };

  useEffect(() => {
    getReminderTypeList();
    setEditReminderTypeDetails({});
  }, []);

  return (
    <section>
      <Dashboard sidebarType="System Admin">
        {currentPage ? (
          <ReminderTypeList
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getReminderTypeList={getReminderTypeList}
            remindertypeList={remindertypeList} // Fixed prop name
            setEditReminderTypeDetails={setEditReminderTypeDetails}
          />
        ) : (
          <AddReminderTypeForm
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getReminderTypeList={getReminderTypeList}
            editReminderTypeDetails={editReminderTypeDetails}
          />
        )}
      </Dashboard>
    </section>
  );
};

export default ReminderTypeConfig;
