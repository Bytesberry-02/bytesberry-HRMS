/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { IoChevronBackCircleOutline } from "react-icons/io5";

import axios from "../../../../../api/axios";
import { MASTER_REMINDER_TYPE_CONFIG_URL} from "../../../../../api/api_routing_urls";

import HeadingAndButton from "../../../../../reusable-components/HeadingAndButton";
import Input from "../../../../../reusable-components/inputs/InputTextBox/Input";
import Spinner from "../../../../../reusable-components/spinner/spinner.component";

import showToast from "../../../../../utilities/notification/NotificationModal";

const AddReminderTypeForm = ({
  setCurrentPage,
  currentPage,
  getReminderTypeList,
  editReminderTypeDetails,
}) => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const isEdit = Object.keys(editReminderTypeDetails)?.length > 0;

  const defaultValues = {
    reminder_type_id: !isEdit ? "" : editReminderTypeDetails?.reminder_type_id,
    reminder_type_name: !isEdit ? "" : editReminderTypeDetails?.reminder_type_name,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
    getValues,
    setValue,
    control,
  } = useForm({
    defaultValues: defaultValues,
  });

  const onSubmit = async (data) => {
    setIsFormSubmitting(true);
    try {
      let sendDataObj = {
        reminder_type_name: data?.reminder_type_name,
      };

      // console.log("sendDataObj inside onSubmit()", sendDataObj);

      let response = "";

      if (!isEdit) {
        response = await axios.post(MASTER_REMINDER_TYPE_CONFIG_URL, sendDataObj);
      } else {
        sendDataObj.reminder_type_id = defaultValues?.reminder_type_id;

        response = await axios.post(
          `${MASTER_REMINDER_TYPE_CONFIG_URL}/update`,
          sendDataObj
        );
      }

       console.log({ response });

      if (response.status === 200) {
        showToast("Reminder Master Details updated successfully.", "success");
        setCurrentPage(!currentPage);

        getReminderTypeList();
      } else {
        showToast(
          "Whoops!!!! This doesn't feel right. There might be an issue. Please contact the administrator.",
          "error"
        );

        return;
      }
      reset();
    } catch (error) {
      console.error("error", error);
      if (!error?.response) {
        showToast("No Server Response", "error");
      } else if (error.response.status === 422) {
        showToast("Some of the required inputs were not provided.", "error");
      } else {
        showToast(
          "Whoops!!!! This doesn't feel right. There might be an issue. Please contact the administrator.",
          "error"
        );
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen py-8">
      <HeadingAndButton
        title="Add Reminder Details"
        buttonText="Go Back"
        buttonIcon={IoChevronBackCircleOutline}
        onButtonClick={() => setCurrentPage(!currentPage)}
      />

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1">
            <Input
              defaultName="reminder_type_name"
              register={register}
              name="Reminder Name"
              required={true}
              pattern={null}
              errors={errors}
              placeholder="Enter Reminder name"
              setError={setError}
              clearError={clearErrors}
              autoComplete="off"
              type="text"
              classes={`px-3 py-2 text-sm w-full`}
              onChangeInput={null}
              defaultValue={defaultValues.reminder_type_name}
              setValue={setValue}
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 mb-5 w-full grid grid-cols-3">
            {!isFormSubmitting ? (
              <button
                type="submit"
                className="col-start-2 flex justify-self-center items-center bg-primary w-fit text-white py-2 px-5 rounded cursor-pointer"
              >
                <span className="text-sm font-medium">
                  {!isEdit ? "Submit" : "Update"}
                </span>
              </button>
            ) : (
              <div className="col-start-2 flex justify-self-center items-center bg-primary w-fit text-white py-2 px-5 rounded cursor-pointer">
                <div className="flex gap-x-1 items-center">
                  <p className="text-sm font-medium">
                    {!isEdit ? "Submitting" : "Updating"}
                  </p>
                  <p className="pl-1">
                    <Spinner />
                  </p>
                </div>
              </div>
            )}

            <div
              onClick={() => setCurrentPage(!currentPage)}
              className="justify-self-end py-2 px-5 border rounded cursor-pointer text-sm font-medium"
            >
              Cancel
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddReminderTypeForm;
