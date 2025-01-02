/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import axios from "../../../../../api/axios";
import { MASTER_GENDER_CONFIG_URL } from "../../../../../api/api_routing_urls";

import showToast from "../../../../../utilities/notification/NotificationModal";

import Dashboard from "../../../common/dashboard-components/dashboard.component";

import GenderList from "./genderList.component";
import AddGenderForm from "./addGenderForm.component";

const GenderConfig = () => {
  const [currentPage, setCurrentPage] = useState(true);

  const [editGenderDetails, setEditGenderDetails] = useState({});

  const [genderList, setGenderList] = useState();

  const getGenderList = async () => {
    try {
      const response = await axios.get(MASTER_GENDER_CONFIG_URL);
      // console.log("Gender List", { response });
      response.status === 200 && setGenderList(response?.data?.mstGenderList);
      response.status === 202 &&
        showToast("No gender list found in the system.", "error");
    } catch (error) {
      console.error("getGenderList", error);
      if (!error?.response) {
        showToast("No Server Response");
      } else if (error.response.status === 422) {
        showToast("Some of the required inputs were not provided.", "error");
      } else {
        showToast(
          "Whoops!!!! This doesn't feel right. There might be an issue. Please contact the administrator.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getGenderList();
      setEditGenderDetails({});
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <Dashboard sidebarType="System Admin">
        {currentPage ? (
          <GenderList
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getGenderList={getGenderList}
            genderList={genderList}
            setEditGenderDetails={setEditGenderDetails}
          />
        ) : (
          <AddGenderForm
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            getGenderList={getGenderList}
            editGenderDetails={editGenderDetails}
          />
        )}
      </Dashboard>
    </section>
  );
};

export default GenderConfig;
