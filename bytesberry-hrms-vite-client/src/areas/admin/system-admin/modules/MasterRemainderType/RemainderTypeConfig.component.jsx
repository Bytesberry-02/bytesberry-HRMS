/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import axios from "../../../../../api/axios";
import { MASTER_REMAINDER_TYPE_CONFIG_URL } from "../../../../../api/api_routing_urls";

import showToast from "../../../../../utilities/notification/NotificationModal";

import Dashboard from "../../../common/dashboard-components/dashboard.component";

import AddRemainderTypeForm from "./addRemainderTypeForm.component";
import RemainderTypeList from "./RemainderTypeList.component";

const RemainderTypeConfig = () => {
  const [currentPage, setCurrentPage] = useState(true);
  const [editRemainderTypeDetails, setEditRemainderTypeDetails] = useState({});
  const [remaindertypeList, setRemainderTypeList] = useState([]);

  const getRemainderTypeList = async () => {
    try {
      const response = await axios.get(MASTER_REMAINDER_TYPE_CONFIG_URL);
      //console.log("API Response:", response.data); // Debugging API response

      if (response.status === 200 && response.data?.mstRemainderTypeList) {
        setRemainderTypeList([...response.data.mstRemainderTypeList]);
        //console.log("Updated Remainder List:", response.data.mstRemainderTypeList);
      } else if (response.status === 202) {
        showToast("No remainder types found.", "error");
        setRemainderTypeList([]); // Ensure an empty array if no data is found
      }
    } catch (error) {
      console.error("Error fetching remainder types:", error);
      showToast("Error fetching data. Contact admin.", "error");
    }
  };

  useEffect(() => {
    getRemainderTypeList();
    setEditRemainderTypeDetails({});
  }, []);

  return (
    <section>
      <Dashboard sidebarType="System Admin">
        {currentPage ? (
          <RemainderTypeList
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getRemainderTypeList={getRemainderTypeList}
            remaindertypeList={remaindertypeList} // Fixed prop name
            setEditRemainderTypeDetails={setEditRemainderTypeDetails}
          />
        ) : (
          <AddRemainderTypeForm
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getRemainderTypeList={getRemainderTypeList}
            editRemainderTypeDetails={editRemainderTypeDetails}
          />
        )}
      </Dashboard>
    </section>
  );
};

export default RemainderTypeConfig;
