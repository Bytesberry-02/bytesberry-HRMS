const pool = require("../../dbConfig");

const {
  saveReminderDetailsSchema,
  updateReminderDetailsSchema,
  deleteReminderDetailsSchema,
} = require("../../schemas/system-admin/mClientReminderSchema");

const getClientReminderList = async (req, res) => {
  try {
    const clientReminderList = await pool.query(
      "SELECT * FROM get_client_reminder_details_list() AS client_reminder_list;"
    );

    res.status(200).json({
      clientReminderList:
        clientReminderList.rowCount > 0
          ? clientReminderList.rows[0].client_reminder_list
          : [],
      status: 200,
      errMsg: "",
    });
  } catch (error) {
    console.log("getClientReminderList Error:", error);
    res.status(500).json({ status: 500, errMsg: error.message });
  }
};

const saveClientReminderDetails = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    const schemaValidation = await saveReminderDetailsSchema.validateAsync(
      req.body
    );

    const {
      client_id,
      reminder_type_id,
      plan_id,
      reminder_type_renewal_date,
      admin_remarks,
      status,
    } = schemaValidation;

    // Call the simplified plan-based function
    const saveReminderDetails = await pool.query(
      "SELECT * FROM add_client_reminder_details($1, $2, $3, $4, $5, $6,$7,$8)",
      [
        client_id,
        reminder_type_id,
        plan_id,
        null, 
        false, // is_addressed
        admin_remarks,
        reminder_type_renewal_date,
        status ,//update status
      ]
    );

    if (saveReminderDetails.rows[0].add_client_reminder_details === "true") {
      res.status(200).json({
        saveReminderDetails:
          saveReminderDetails.rows[0].add_client_reminder_details,
        status: 200,
        errMsg: "",
      });
    } else {
      res.status(202).json({
        saveReminderDetails:
          saveReminderDetails.rows[0].add_client_reminder_details,
        status: 202,
        errMsg: "",
      });
    }
  } catch (error) {
    console.log("saveClientReminderDetails Error:", error);
    if (error.isJoi === true) {
      res.status(422).json({
        saveReminderDetails: {},
        status: 422,
        errMsg: error.message,
      });
    } else {
      res.status(500).json({
        saveReminderDetails: {},
        status: 500,
        errMsg: error.message,
      });
    }
  }
};

const updateClientReminderDetails = async (req, res) => {
  try {
    const schemaValidation = await updateReminderDetailsSchema.validateAsync(req.body);
    
    const {
      reminder_details_id,
      client_id,
      reminder_type_id,
      plan_id, // NEW: Added plan_id
      admin_remarks,
      reminder_type_renewal_date,
      status,
    } = schemaValidation;
    
    const updated_by = req.user?.username || 'Admin';
    
    // Call the updated SQL function with correct parameter order
    const updateClientReminderDetails = await pool.query(
      "SELECT * FROM update_client_reminder_details($1, $2, $3, $4, $5, $6, $7,$8)",
      [
        reminder_details_id,
        client_id,
        reminder_type_id,
        plan_id, 
        admin_remarks || '',
        reminder_type_renewal_date,
        updated_by,
        status,
      ]
    );
    
    const result = updateClientReminderDetails.rows[0]?.update_client_reminder_details;
    
    if (result === "true") {
      res.status(200).json({
        updateClientReminderDetails: result,
        status: 200,
        errMsg: "",
      });
    } else {
      res.status(202).json({
        updateClientReminderDetails: result,
        status: 202,
        errMsg: "",
      });
    }
  } catch (error) {
    console.log("updateClientReminderDetails Error:", error);
    if (error.isJoi === true) {
      res.status(422).json({
        updateClientReminderDetails: {},
        status: 422,
        errMsg: error.message,
      });
    } else {
      res.status(500).json({
        updateClientReminderDetails: {},
        status: 500,
        errMsg: error.message,
      });
    }
  }
};

const deleteClientReminderDetails = async (req, res) => {
  try {
    const schemaValidation = await deleteReminderDetailsSchema.validateAsync(req.body);

    console.log("Validated Input:", schemaValidation);

    const deleteReminderDetails = await pool.query(
      "SELECT delete_client_reminder_details($1) AS result_message",
      [schemaValidation.reminder_details_id]
    );

    console.log("DB Response:", deleteReminderDetails.rows);

    const resultMessage = deleteReminderDetails.rows[0]?.result_message || "No record found";

    if (resultMessage === "Delete successful") {
      return res.status(200).json({
        success: true,
        message: `Record with ID ${schemaValidation.reminder_details_id} deleted successfully`,
      });
    }

    res.status(404).json({ success: false, message: resultMessage });

  } catch (error) {
    console.log("deleteClientReminderDetails Error:", error);
    res.status(500).json({
      status: 500,
      errMsg: error.message,
    });
  }
};

module.exports = {
    getClientReminderList,
    saveClientReminderDetails,  
    updateClientReminderDetails,
    deleteClientReminderDetails,
};