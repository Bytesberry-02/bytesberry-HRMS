/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import { FiEdit2 } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { MdAdd } from "react-icons/md";

import axios from "../../../../../api/axios";
import { MASTER_GENDER_CONFIG_URL } from "../../../../../api/api_routing_urls";

import HeadingAndButton from "../../../../../reusable-components/HeadingAndButton";
import DeleteModal from "../../../../../reusable-components/modals/DeleteModal";

import showToast from "../../../../../utilities/notification/NotificationModal";

const GenderList = ({
  setCurrentPage,
  currentPage,
  getGenderList,
  genderList,
  setEditGenderDetails,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [genderDeleteId, setGenderDeleteId] = useState(null);

  const onClickEdit = (genderObj) => {
    // console.log("genderObj received inside Edit: ", genderObj);
    setEditGenderDetails(genderObj);
    setCurrentPage(!currentPage);
  };

  const onClickDelete = async () => {
    // console.log("Received ID to delete: ", genderDeleteId);
    try {
      let response = "";
      if (genderDeleteId) {
        response = await axios.post(`${MASTER_GENDER_CONFIG_URL}/delete`, {
          gender_id: genderDeleteId,
        });
        setShowDelete(false);
      }

      if (response.status === 200) {
        showToast(
          "Gender Master details has been deleted successfully.",
          "success"
        );
        getGenderList();
      } else {
        showToast("Gender Master details deletion failed.", "error");
      }
    } catch (error) {
      console.log("Delete Gender Master Error", error);
    } finally {
      setEditGenderDetails(null);
    }
  };

  return (
    <section className="py-8 bg-white min-h-screen">
      <div>
        <HeadingAndButton
          title="Gender Master Configuration"
          buttonText="  Add Gender Details"
          buttonIcon={MdAdd}
          onButtonClick={() => {
            setCurrentPage(!currentPage);
            setEditGenderDetails({});
          }}
        />

        <div className="mt-10">
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="pl-4 py-2 w-[10%] text-start">Sl. No.</th>
                <th className="w-[80%] text-start">Gender Name</th>
                <th className="w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genderList?.length > 0 ? (
                <>
                  {genderList?.map((mapObj, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-slate-50" : "bg-slate-100"
                      }`}
                    >
                      <td className="pl-4 py-4">{index + 1}</td>

                      <td>{mapObj?.gender_name}</td>

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
                            setGenderDeleteId(mapObj?.gender_id || null);
                            setShowDelete(true);
                          }}
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </>
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

      <>
        <DeleteModal
          open={showDelete}
          setOpen={setShowDelete}
          message={"This entry will be deleted permanently. Are you sure?"}
          onDelete={onClickDelete}
        />
      </>
    </section>
  );
};

export default GenderList;
