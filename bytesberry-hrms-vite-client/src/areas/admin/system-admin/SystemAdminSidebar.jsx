/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { GrDocumentConfig } from "react-icons/gr";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";

export default function SystemAdminSidebar({
  // keep the pathname later to highlight the selected text
  pathname,
}) {
  return (
    <section>
      <div className="text-slate-700">
        <ul>
          <li>
            <div className="flex items-center gap-x-2 mb-4">
              <MdOutlineDashboardCustomize size={20} />
              <div className="text-lg cursor-pointer">
                <Link to="/system-admin/dashboard" className="py-1">
                  <p
                    className={`shrink-0 ${
                      pathname.includes("/system-admin/dashboard")
                        ? "text-slate-700 font-semibold"
                        : "text-slate-700 font-normal"
                    }`}
                  >
                    Dashboard
                  </p>
                </Link>
              </div>
            </div>
          </li>

          {/* Master Config */}
          <div className="flex gap-2 items-center">
            <GrDocumentConfig size={16} />

            <div className="text-slate-700">Master Configuration</div>
          </div>

          {/* Master Config sub-menu */}
          <>
            <div className="text-sm cursor-pointer flex items-center mb-5">
              <ul className="pl-12">
                <li className="pt-2">
                  <Link to="/system-admin/master-config-gender">
                    <span
                      className={`shrink-0 ${
                        pathname.includes("/system-admin/master-config-gender")
                          ? "text-slate-700 font-semibold"
                          : "text-slate-500 font-normal"
                      } font-medium`}
                    >
                      Gender
                    </span>
                  </Link>
                </li>

                <li className="pt-2">
                  <Link to="/system-admin/master-config-reminder-type" className="pt-2">
                    <span
                      className={`shrink-0 ${
                        pathname.includes("/system-admin/master-config-reminder-type")
                          ? "text-slate-700 font-semibold"
                          : "text-slate-500 font-normal"
                      } font-medium`}
                    >
                      Reminder Type
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </>

          <li>
            <div className="flex items-center gap-x-2 mb-4">
              <FaUsers size={20} />
              <div className="text-lg cursor-pointer">
                <Link to="/system-admin/client-reminder-config" className="py-1">
                  <p
                    className={`shrink-0 ${
                      pathname.includes("/system-admin/client-reminder-config")
                        ? "text-slate-700 font-semibold"
                        : "text-slate-700 font-normal"
                    }`}
                  >
                    Reminder Details Management
                  </p>
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
