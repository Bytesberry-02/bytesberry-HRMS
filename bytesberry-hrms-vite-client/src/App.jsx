/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import DesktopOnlyRoute from "./areas/DesktopOnlyRoute";

import LoginForm from "./areas/public/pages/loginForm.component";
import DemoPage from "./areas/public/pages/demoPage.component";


import SystemAdminDashboard from "./areas/admin/system-admin/SystemAdminDashboard";

import GenderConfig from "./areas/admin/system-admin/modules/MasterGender/genderConfig.component";
import ReminderTypeConfig from "./areas/admin/system-admin/modules/MasterReminderType/ReminderTypeConfig.component";
import ClientReminderConfig from "./areas/admin/system-admin/modules/ClientReminderDetails/ClientReminderConfig.component";


function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route exact path="/demo" element={<DemoPage />} />


        {/* System Admin */}
        <Route
          exact
          path="/system-admin/dashboard"
          element={
            <SystemAdminDashboard />
          }
        />

        <Route
          exact
          path="/system-admin/master-config-gender"
          element={
            <GenderConfig />
          }
        />

        <Route
          exact
          path="/system-admin/master-config-reminder-Type"
          element={
            <ReminderTypeConfig />
          }
        />
        <Route
          exact
          path="/system-admin/client-reminder-config"
          element={
            <ClientReminderConfig />
          }
        />
      </Routes>
    </>
  );
}

export default App;
