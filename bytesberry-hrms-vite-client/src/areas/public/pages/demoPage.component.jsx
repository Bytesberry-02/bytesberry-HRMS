/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import axios from "../../../api/axios";
import {
  MASTER_GENDER_CONFIG_URL,
  EMPLOYEE_CONFIG_URL,
} from "../../../api/api_routing_urls";

import Input from "../../../reusable-components/inputs/InputTextBox/Input";
import Dropdown from "../../../reusable-components/Dropdowns/Dropdown";
import TextArea from "../../../reusable-components/inputs/InputTextAreas/TextArea";
import Spinner from "../../../reusable-components/spinner/spinner.component";

const DemoPage = () => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [editEmployeeDetails, setEditEmployeeDetails] = useState({});

  const [genderDD, setGenderDD] = useState([]);
  const [genderList, setGenderList] = useState();

  const [selectedGender, setSelectedGender] = useState(null);

  const getGenderList = async () => {
    try {
      const response = await axios.get(MASTER_GENDER_CONFIG_URL);
      //   console.log("Gender List", { response });
      let genderDD = [];

      if (response.status === 200) {
        response?.data?.mstGenderList?.map((genderObj) => {
          genderDD.push({
            label: genderObj?.gender_name,
            value: genderObj?.gender_id,
          });
        });
        setGenderDD(genderDD);
        // console.log("genderDD", genderDD);
      }

      response.status === 200 && setGenderList(response?.data?.mstGenderList);

      response.status === 202 &&
        console.log("No gender list found in the system.", "error");
    } catch (error) {
      console.error("getGenderList", error);
      if (!error?.response) {
        console.log("No Server Response");
      } else if (error.response.status === 422) {
        console.log("Some of the required inputs were not provided.", "error");
      } else {
        console.log(
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
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const getEmployeeList = () => {};

  const isEdit = Object.keys(editEmployeeDetails)?.length > 0;

  const defaultValues = {
    employee_id: !isEdit ? "" : editEmployeeDetails?.employee_id,
    employee_name: !isEdit ? "" : editEmployeeDetails?.employee_name,
    employee_address: !isEdit ? "" : editEmployeeDetails?.employee_address,

    gender_id: !isEdit
      ? ""
      : editEmployeeDetails?.gender_id
      ? genderDD.filter(
          (obj) => obj.value === editEmployeeDetails?.gender_id
        )[0]
      : null,
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
        employee_name: data?.employee_name,
        gender_id: selectedGender?.value || null,
      };

      // console.log("sendDataObj inside onSubmit()", sendDataObj);

      let response = "";

      if (!isEdit) {
        response = await axios.post(EMPLOYEE_CONFIG_URL, sendDataObj);
      } else {
        sendDataObj.employee_id = defaultValues?.employee_id;

        response = await axios.post(
          `${EMPLOYEE_CONFIG_URL}/update`,
          sendDataObj
        );
      }

      // console.log({ response });

      if (response.status === 200) {
        console.log("Member Details logged successfully.", "success");

        getEmployeeList();
      } else {
        console.log(
          "Whoops!!!! This doesn't feel right. There might be an issue. Please contact the administrator.",
          "error"
        );

        return;
      }
      reset();
    } catch (error) {
      console.error("error", error);
      if (!error?.response) {
        console.log("No Server Response", "error");
      } else if (error.response.status === 422) {
        console.log("Some of the required inputs were not provided.", "error");
      } else {
        console.log(
          "Whoops!!!! This doesn't feel right. There might be an issue. Please contact the administrator.",
          "error"
        );
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <section className="mt-20">
      <div className="text-lg md:text-xl lg:text-3xl text-center font-bold">
        Demo Page
      </div>

      <div className="mt-10 w-[60vw] mx-auto bg-yellow-50 pt-5 pb-1 px-4 rounded-lg">
        <form
        // onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Input
              defaultName="employee_name"
              register={register}
              name="Employee Name"
              required={true}
              pattern={null}
              errors={errors}
              placeholder="Enter employee name"
              setError={setError}
              clearError={clearErrors}
              autoComplete="off"
              type="text"
              classes={`px-3 py-2 text-sm w-full`}
              onChangeInput={null}
              defaultValue={defaultValues.employee_name}
              setValue={setValue}
            />

            <Dropdown
              defaultName="gender_id"
              register={register}
              labelname="Gender"
              required={true}
              pattern={false}
              errors={errors}
              classes={`rounded-lg text-sm w-full z-40`}
              setError={setError}
              clearError={clearErrors}
              onChangeInput={null}
              control={control}
              data={genderDD}
              defaultValue={defaultValues.gender_id}
              setValue={setValue}
              setSelected={setSelectedGender}
              selected={selectedGender}
              maxMenuHeight={120}
            />

            <div className="col-span-2">
              <TextArea
                defaultName="employee_address"
                register={register}
                name="Employee Address"
                required={false}
                pattern={null}
                errors={errors}
                placeholder={"Enter employee's address"}
                setError={setError}
                clearError={clearErrors}
                autoComplete="off"
                type="text"
                classes={`rounded-sm px-3 py-2 text-sm w-full resize-none h-32`}
                onChangeInput={null}
                defaultValue={defaultValues.employee_address}
                setValue={setValue}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-16 mb-5 w-full grid grid-cols-3">
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

            <div className="justify-self-end py-2 px-5 border rounded cursor-pointer text-sm font-medium">
              Cancel
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DemoPage;
