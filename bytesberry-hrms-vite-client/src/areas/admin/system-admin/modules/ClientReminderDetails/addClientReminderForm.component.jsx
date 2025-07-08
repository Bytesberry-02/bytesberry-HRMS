import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import axios from "../../../../../api/axios";
import { CLIENT_REMINDER_CONFIG_URL, MASTER_REMINDER_TYPE_CONFIG_URL, MASTER_CLIENT_CONFIG_URL, MASTER_PLANS_CONFIG_URL } from "../../../../../api/api_routing_urls";
import HeadingAndButton from "../../../../../reusable-components/HeadingAndButton";
import Input from "../../../../../reusable-components/inputs/InputTextBox/Input";
import Dropdown from "../../../../../reusable-components/Dropdowns/Dropdown";
import Spinner from "../../../../../reusable-components/spinner/spinner.component";
import showToast from "../../../../../utilities/notification/NotificationModal";

const ClientReminderForm = ({ setCurrentPage, getReminderList, editReminderDetails }) => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [reminderTypeDD, setReminderTypeDD] = useState([]);
  const [loadingReminderTypes, setLoadingReminderTypes] = useState(true);
  const [selectedReminderType, setSelectedReminderType] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  


  const isEdit = !!editReminderDetails?.reminder_details_id;
  //hold or active clients 
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Hold", value: "hold" }, 
  ];
const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  // Form setup 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch
  } = useForm({
    mode: "onChange"
  });

  const expiryDate = watch("reminder_type_expiry_date");

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(MASTER_CLIENT_CONFIG_URL);
        const fetchedClients = response.data?.mstClientList || [];
        const transformedClients = fetchedClients.map((client) => ({
          label: client.client_name,
          value: client.client_id,
        }));
        setClients(transformedClients);
        setLoadingClients(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        showToast("Failed to load clients. Please try again.", "error");
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch reminder types
  useEffect(() => {
    const fetchReminderTypes = async () => {
      try {
        const response = await axios.get(MASTER_REMINDER_TYPE_CONFIG_URL);
        const fetchedReminderTypes = response.data?.mstReminderTypeList || [];

        const transformedTypes = fetchedReminderTypes.map((type) => ({
          label: type.reminder_type_name,
          value: type.reminder_type_id
        }));

        setReminderTypeDD(transformedTypes);
        setLoadingReminderTypes(false);
      } catch (error) {
        console.error("Error fetching reminder types:", error);
        showToast("Failed to load reminder types. Please check your network connection.", "error");
        setLoadingReminderTypes(false);
      }
    };

    fetchReminderTypes();
  }, []);

  // Fetch plans data
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log("Fetching plans from:", MASTER_PLANS_CONFIG_URL);
        const response = await axios.get(MASTER_PLANS_CONFIG_URL);
        console.log("Plans API response:", response.data);

        const fetchedPlans = response.data?.mstPlansList || [];
        console.log("Fetched plans:", fetchedPlans);

        const transformedPlans = fetchedPlans.map((plan) => ({
          label: plan.plan_name,
          value: plan.plan_id
        }));

        console.log("Transformed plans:", transformedPlans);
        setPlans(transformedPlans);
        setLoadingPlans(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        console.error("Error details:", error.response?.data);
        showToast("Failed to load Plans. Please check network connection.", "error");
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setValue("reminder_details_id", editReminderDetails.reminder_details_id || "");
      setValue("reminder_type_renewal_date", editReminderDetails.reminder_type_renewal_date || "");
      setValue("admin_remarks", editReminderDetails.admin_remarks || "");
    }
  }, [isEdit, editReminderDetails, setValue]);
  useEffect(() => {
    if (isEdit) {
      if (editReminderDetails.status) {
        const statusMatch = statusOptions.find(opt => opt.value === editReminderDetails.status);
        if (statusMatch) {
          setSelectedStatus(statusMatch);
          setValue("status", statusMatch.value);
        }
      } else {
        setSelectedStatus(statusOptions[0]);
        setValue("status", statusOptions[0].value);
      }
    } else {
      setSelectedStatus(statusOptions[0]);
      setValue("status", statusOptions[0].value);
    }
  }, [isEdit, editReminderDetails, setValue]);

  // Handle setting client selection after data is loaded
  useEffect(() => {
    if (isEdit && clients.length > 0 && !loadingClients && editReminderDetails?.client_name) {
      const clientMatch = clients.find(
        client => client.label === editReminderDetails.client_name
      );

      if (clientMatch) {
        setSelectedClient(clientMatch);
        setValue("client_id", clientMatch.value);
      }
    }
  }, [isEdit, editReminderDetails, clients, loadingClients, setValue]);

  // Handle setting reminder type selection after data is loaded
  useEffect(() => {
    if (isEdit && reminderTypeDD.length > 0 && !loadingReminderTypes && editReminderDetails?.reminder_type_name) {
      const typeMatch = reminderTypeDD.find(
        type => type.label === editReminderDetails.reminder_type_name
      );

      if (typeMatch) {
        setSelectedReminderType(typeMatch);
        setValue("reminder_type_id", typeMatch.value);
      }
    }
  }, [isEdit, editReminderDetails, reminderTypeDD, loadingReminderTypes, setValue]);

  // Handle setting plan selection after data is loaded 
  useEffect(() => {
    if (isEdit && plans.length > 0 && !loadingPlans && editReminderDetails?.plan_id) {
      const planMatch = plans.find(plan => plan.value === editReminderDetails.plan_id);
      if (planMatch) {
        setSelectedPlan(planMatch);
        setValue("plan_id", planMatch.value);
      }
    }
  }, [isEdit, editReminderDetails, plans, loadingPlans, setValue]);




  // Handle form submission
  const onSubmit = async (data) => {
    setIsFormSubmitting(true);
    try {

      if (!selectedClient) {
        showToast("Please select a client", "error");
        setIsFormSubmitting(false);
        return;
      }

      if (!selectedReminderType) {
        showToast("Please select a reminder type", "error");
        setIsFormSubmitting(false);
        return;
      }

      if (!selectedPlan) { 
        showToast("Please select a plan", "error");
        setIsFormSubmitting(false);
        return;
      }

      const payload = {
        client_id: Number(selectedClient.value),
        reminder_type_id: Number(selectedReminderType.value),
        plan_id: Number(selectedPlan.value),
        reminder_type_renewal_date: data.reminder_type_renewal_date || null,
        admin_remarks: data.admin_remarks || "",
        status:selectedStatus.value,
      };

      if (isEdit) {
        payload.reminder_details_id = editReminderDetails.reminder_details_id;
        // payload.is_addressed = editReminderDetails.is_addressed !== undefined 
        //   ? editReminderDetails.is_addressed 
        //   : false;
      }

      console.log("Submitting payload:", payload);

      const endpoint = isEdit
        ? `${CLIENT_REMINDER_CONFIG_URL}/update`
        : CLIENT_REMINDER_CONFIG_URL;

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        showToast(`Reminder ${isEdit ? "updated" : "created"} successfully!`, "success");
        setCurrentPage("list");
        getReminderList();
      }

    } catch (error) {
      console.error("Form submission error:", error);

      let errorMessage = "Operation failed. Please check your inputs and try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  
  return (
    <section className="bg-white min-h-screen py-8 px-4">
      <HeadingAndButton
        title={isEdit ? "Edit Client Reminder" : "Add Client Reminder"}
        buttonText="Go Back"
        buttonIcon={IoChevronBackCircleOutline}
        onButtonClick={() => setCurrentPage("list")}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto mt-8 bg-gray-50 p-8 rounded-lg shadow-md">


        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <Dropdown
            defaultName="client_id"
            register={register}
            labelname="Client"
            required={true}
            pattern={false}
            errors={errors}
            classes={`rounded-lg text-sm w-full z-40`}
            control={control}
            data={clients}
            isLoading={loadingClients}
            setValue={setValue}
            setSelected={setSelectedClient}
            selected={selectedClient}
            clearError={() => { }}
            defaultValue={isEdit && editReminderDetails?.client_name ? editReminderDetails.client_name : ""}
          />

          <Dropdown
            defaultName="reminder_type_id"
            register={register}
            labelname="Reminder Type"
            required={true}
            pattern={false}
            errors={errors}
            classes={`rounded-lg text-sm w-full z-50`}
            control={control}
            data={reminderTypeDD}
            setValue={setValue}
            setSelected={setSelectedReminderType}
            selected={selectedReminderType}
            clearError={() => { }}
            defaultValue={isEdit && editReminderDetails?.reminder_type_name ? editReminderDetails.reminder_type_name : ""}
            isLoading={loadingReminderTypes}
          />



          <Input
            name="Renewal Date"
            defaultName="reminder_type_renewal_date"
            register={register}
            required={false}
            errors={errors}
            type="date"
            setValue={setValue}
            classes={`px-3 py-2 text-sm w-full`}
            defaultValue={isEdit ? editReminderDetails.reminder_type_renewal_date : ""}
          />
          <Dropdown
            defaultName="plan_id"
            register={register}
            labelname="Plan"
            required={true}
            pattern={false}
            errors={errors}
            classes={`rounded-lg text-sm w-full z-40`}
            control={control}
            data={plans}
            setValue={setValue}
            setSelected={setSelectedPlan} 
            selected={selectedPlan} 
            clearError={() => { }}
            defaultValue={isEdit && editReminderDetails?.plan_name ? editReminderDetails.plan_name : ""}
            isLoading={loadingPlans}
          />
          <Dropdown
            defaultName="status"
            register={register}
            labelname="Status"
            required={true}
            pattern={false}
            errors={errors}
            classes="rounded-lg text-sm w-full z-40"
            control={control}
            data={statusOptions}
            setValue={setValue}
            setSelected={setSelectedStatus}
            selected={selectedStatus}
            clearError={() => { }}
            defaultValue={isEdit && editReminderDetails?.status ? editReminderDetails.status : "active"}
            isLoading={false}
          />

          <div className="md:col-span-2">
            <Input
              name="Admin Remarks"
              defaultName="admin_remarks"
              register={register}
              required={false}
              errors={errors}
              type="text"
              setValue={setValue}
              classes={`px-3 py-2 text-lg w-full h-16`}
              placeholder="Enter any additional notes or context"
              defaultValue={isEdit ? editReminderDetails.admin_remarks : ""}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isFormSubmitting || loadingClients || loadingReminderTypes || loadingPlans}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
          >
            {isFormSubmitting ? (
              <>
                <Spinner size="small" className="mr-2" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEdit ? "Update Reminder" : "Create Reminder"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ClientReminderForm;