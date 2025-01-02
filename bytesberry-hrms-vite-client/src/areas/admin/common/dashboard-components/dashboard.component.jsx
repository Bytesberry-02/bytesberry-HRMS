/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "./header.component";
import Sidebar from "./sidebar.component";

export default function Dashboard(props) {
  const [sideBarType, setSideBarType] = useState(2);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (isMounted) {
  //     setSideBarType(localStorage.getItem("roleid"));
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // console.log("sideBarType", sideBarType);
  return (
    <div className="flex h-screen overflow-hidden bg-contain bg-center">
      {/* Sidebar */}
      <Sidebar sideBarType={sideBarType} setSideBarType={setSideBarType} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <div>
          <Header />
        </div>

        <main>
          <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
            {/* py-8 removing from here. Add  if needed*/}
            {props?.children}
          </div>
        </main>
      </div>
    </div>
  );
}
