/* eslint-disable no-unused-vars */
import React from "react";

import Dashboard from "../common/dashboard-components/dashboard.component";

export default function SystemAdminDashboard() {
  return (
    <>
      <section className="hidden lg:block">
        <Dashboard>
          <div className="flex items-center justify-center mt-9">
            <div className="text-center text-slate-700">
              <p className="text-4xl font-semibold text-[#124277]">
                Welcome System Admin!
              </p>
            </div>
          </div>
        </Dashboard>
      </section>

      <section className="relative  w-[90%] mx-auto">
        <div className="mt-36 flex flex-col items-center justify-center">
          <p className="text-base font-semibold text-center">
            Bytesberry Technologies
          </p>
        </div>

        <div className="mt-10 text-center text-xs font-semibold">
          This dashboard is currently accessible only on Desktops and Laptops.
          Please visit us using a desktop device for the best experience.
        </div>
      </section>
    </>
  );
}
