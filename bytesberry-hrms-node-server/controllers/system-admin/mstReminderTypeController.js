const pool = require("../../dbConfig");

const {
    saveMstReminderTypeDetailsSchema,
    updateMstReminderTypeDetailsSchema,
    deleteMstReminderTypeDetailsSchema } = require("../../schemas/system-admin/mstReminderTypeSchema");
const getMstReminderTypeList = async (req, res, next) => {
    try {
        const mstReminderTypeList = await pool.query(
            "SELECT * FROM get_mst_reminder_type_list() as mst_reminder_type_list;"
        );
        // console.log("mstGenderList", mstGenderList.rows);
        res.status(200).json({
            mstReminderTypeList:
                mstReminderTypeList.rowCount > 0 ? mstReminderTypeList.rows[0].mst_reminder_type_list : [],
            status: 200,
            errMsg: "",
        });
    } catch (error) {
        console.log("getMstReminderTypeList", error);
    }
};

const saveMstReminderTypeDetails = async (req, res, next) => {
    try {
        const schemaValidation = await saveMstReminderTypeDetailsSchema.validateAsync(
            req.body
        );

        const { reminder_type_name } = schemaValidation;

        const saveMstReminderTypeDetails = await pool.query(
            "SELECT * FROM add_mst_reminder_type_details($1)",
            [reminder_type_name]
        );

        // console.log("saveMstGenderDetails.rows[0]", saveMstGenderDetails.rows[0]);

        if (saveMstReminderTypeDetails.rows[0].add_mst_reminder_type_details === "true") {
            res.status(200).json({
                saveMstReminderTypeDetails:
                    saveMstReminderTypeDetails.rows[0].add_mst_reminder_type_details,
                status: 200,
                errMsg: "",
            });
        } else {
            res.status(202).json({
                saveMstReminderTypeDetails:
                    saveMstReminderTypeDetails.rows[0].add_mst_reminder_type_details,
                status: 202,
                errMsg: "",
            });
        }
    } catch (error) {
        console.log(error);
        if (error.isJoi === true) {
            error.status = 422;
            res.status(422).json({
                saveMstReminderTypeDetails: {},
                status: 422,
                errMsg: error.message,
            });
        } else {
            res.status(500).json({
                saveMstReminderTypeDetails: {},
                status: 500,
                errMsg: error.message,
            });
        }
    }
};

const updateMstReminderTypeDetails = async (req, res, next) => {
    try {
        const schemaValidation = await updateMstReminderTypeDetailsSchema.validateAsync(
            req.body
        );

        const { reminder_type_name,reminder_type_id } = schemaValidation;

        const updateMstReminderTypeDetails = await pool.query(
            "select * from update_mst_reminder_type_details($1,$2)",
            [reminder_type_name,reminder_type_id]
        );
        if (updateMstReminderTypeDetails.rows[0].update_mst_reminder_type_details === "true") {
            res.status(200).json({
                updateMstReminderTypeDetails:
                    updateMstReminderTypeDetails.rows[0].update_mst_reminder_type_details,
                status: 200,
                errMsg: "",
            });
        } else {
            res.status(202).json({
                updateCategoryDetails:
                    updateMstReminderTypeDetails.rows[0].update_mst_reminder_type_details,
                status: 202,
                errMsg: "",
            });
        }
    } catch (error) {
        console.log(error);
        if (error.isJoi === true) {
            error.status = 422;
            res.status(422).json({
                updateCategoryDetails: {},
                status: 422,
                errMsg: error.message,
            });
        } else {
            res.status(500).json({
                updateCategoryDetails: {},
                status: 500,
                errMsg: error.message,
            });
        }
    }
};
const deleteMstReminderTypeDetails = async (req, res) => {
    try {
        const { reminder_type_id } = req.body;

        if (!reminder_type_id) {
            return res.status(400).json({ error: "Missing reminder_type_id" });
        }

        const deleteResult = await pool.query(
            "SELECT delete_mst_reminder_type_details($1) AS result",
            [reminder_type_id]
        );

        // Ensure a valid response
        const isDeleted = deleteResult.rows[0].result;
        
        if (isDeleted === "true") {
            return res.json({ success: true, message: "Deleted successfully" });
        } else if (isDeleted === "false") {
            return res.status(404).json({ error: "Record not found" });
        } else {
            return res.status(500).json({ error: isDeleted }); // Return SQL error if any
        }
    } catch (error) {
        console.error("Delete reminder Details Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports={
    getMstReminderTypeList,
    saveMstReminderTypeDetails,
    updateMstReminderTypeDetails,
    deleteMstReminderTypeDetails
};