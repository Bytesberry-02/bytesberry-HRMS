/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import { FiEdit2 } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { MdAdd } from "react-icons/md";

import axios from "../../../../../api/axios";
import { MASTER_REMAINDER_TYPE_CONFIG_URL } from "../../../../../api/api_routing_urls";

import HeadingAndButton from "../../../../../reusable-components/HeadingAndButton";
import DeleteModal from "../../../../../reusable-components/modals/DeleteModal";

import showToast from "../../../../../utilities/notification/NotificationModal";

const RemainderTypeList = ({
  setCurrentPage,
  currentPage,
  getRemainderTypeList,
  remaindertypeList,
  setEditRemainderTypeDetails,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [remaindertypeDeleteId, setRemainderTypeDeleteId] = useState(null);

  // Handle Edit
  const onClickEdit = (remaindertypeObj) => {
    setEditRemainderTypeDetails(remaindertypeObj);
    setCurrentPage(!currentPage);
  };

  // Handle Delete
  const onClickDelete = async () => {
    try {
        if (remaindertypeDeleteId) {
            //console.log("Deleting ID:", remaindertypeDeleteId); // Debugging Log
            
            const response = await axios.post(`${MASTER_REMAINDER_TYPE_CONFIG_URL}/delete`, {
                remainder_type_id: remaindertypeDeleteId
            });

           // console.log("API Response:", response); // Debugging Log
            setShowDelete(false);

            if (response.status === 200) {
                showToast("Remainder Type deleted successfully.", "success");
                getRemainderTypeList(); // Refresh list after deletion
            } else {
                showToast("Failed to delete Remainder Type.", "error");
            }
        }
    } catch (error) {
        console.error("Delete Error:", error);
        showToast("Error deleting Remainder Type. Try again.", "error");
    } finally {
        setEditRemainderTypeDetails(null);
    }
};

  return (
    <section className="py-8 bg-white min-h-screen">
      <div>
        <HeadingAndButton
          title="Remainder Type Master Configuration"
          buttonText="Add Remainder Type Details"
          buttonIcon={MdAdd}
          onButtonClick={() => {
            setCurrentPage(!currentPage);
            setEditRemainderTypeDetails({});
          }}
        />

        <div className="mt-10">
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="pl-4 py-2 w-[10%] text-start">Sl. No.</th>
                <th className="w-[80%] text-start">Remainder Type Name</th>
                <th className="w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {remaindertypeList?.length > 0 ? (
                remaindertypeList.map((mapObj, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-slate-50" : "bg-slate-100"}>
                    <td className="pl-4 py-4">{index + 1}</td>
                    <td>{mapObj?.remainder_type_name}</td>
                    <td className="flex gap-x-4 items-center justify-center py-4">
                      <FiEdit2
                        color="green"
                        size={14}
                        onClick={() => onClickEdit(mapObj)}
                        className="cursor-pointer"
                      />
                      <BsTrash3
                        color="red"
                        size={16}
                        onClick={() => {
                          setRemainderTypeDeleteId(mapObj?.remainder_type_id || null);
                          setShowDelete(true);
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center text-sm font-semibold">
                  <td colSpan={6} className="py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDelete}
        setOpen={setShowDelete}
        message="This entry will be deleted permanently. Are you sure?"
        onDelete={onClickDelete}
      />
    </section>
  );
};

export default RemainderTypeList;
