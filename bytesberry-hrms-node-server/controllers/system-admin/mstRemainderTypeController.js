const pool = require("../../dbConfig");

const {
    saveMstRemainderTypeDetailsSchema,
    updateMstRemainderTypeDetailsSchema,
    deleteMstRemainderTypeDetailsSchema } = require("../../schemas/system-admin/mstRemainderTypeSchema");
const getMstRemainderTypeList = async (req, res, next) => {
    try {
        const mstRemainderTypeList = await pool.query(
            "SELECT * FROM get_mst_remainder_type_list() as mst_remainder_type_list;"
        );
        // console.log("mstGenderList", mstGenderList.rows);
        res.status(200).json({
            mstRemainderTypeList:
                mstRemainderTypeList.rowCount > 0 ? mstRemainderTypeList.rows[0].mst_remainder_type_list : [],
            status: 200,
            errMsg: "",
        });
    } catch (error) {
        console.log("getMstRemainderTypeList", error);
    }
};

const saveMstRemainderTypeDetails = async (req, res, next) => {
    try {
        const schemaValidation = await saveMstRemainderTypeDetailsSchema.validateAsync(
            req.body
        );

        const { remainder_type_name } = schemaValidation;

        const saveMstRemainderTypeDetails = await pool.query(
            "SELECT * FROM add_mst_remainder_type_details($1)",
            [remainder_type_name]
        );

        // console.log("saveMstGenderDetails.rows[0]", saveMstGenderDetails.rows[0]);

        if (saveMstRemainderTypeDetails.rows[0].add_mst_remainder_type_details === "true") {
            res.status(200).json({
                saveMstRemainderTypeDetails:
                    saveMstRemainderTypeDetails.rows[0].add_mst_remainder_type_details,
                status: 200,
                errMsg: "",
            });
        } else {
            res.status(202).json({
                saveMstRemainderTypeDetails:
                    saveMstRemainderTypeDetails.rows[0].add_mst_remainder_type_details,
                status: 202,
                errMsg: "",
            });
        }
    } catch (error) {
        console.log(error);
        if (error.isJoi === true) {
            error.status = 422;
            res.status(422).json({
                saveMstRemainderTypeDetails: {},
                status: 422,
                errMsg: error.message,
            });
        } else {
            res.status(500).json({
                saveMstRemainderTypeDetails: {},
                status: 500,
                errMsg: error.message,
            });
        }
    }
};

const updateMstRemainderTypeDetails = async (req, res, next) => {
    try {
        const schemaValidation = await updateMstRemainderTypeDetailsSchema.validateAsync(
            req.body
        );

        const { remainder_type_name,remainder_type_id } = schemaValidation;

        const updateMstRemainderTypeDetails = await pool.query(
            "select * from update_mst_remainder_type_details($1,$2)",
            [remainder_type_name,remainder_type_id]
        );
        if (updateMstRemainderTypeDetails.rows[0].update_mst_remainder_type_details === "true") {
            res.status(200).json({
                updateMstRemainderTypeDetails:
                    updateMstRemainderTypeDetails.rows[0].update_mst_remainder_type_details,
                status: 200,
                errMsg: "",
            });
        } else {
            res.status(202).json({
                updateCategoryDetails:
                    updateMstRemainderTypeDetails.rows[0].update_mst_remainder_type_details,
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
const deleteMstRemainderTypeDetails = async (req, res) => {
    try {
        const { remainder_type_id } = req.body;

        if (!remainder_type_id) {
            return res.status(400).json({ error: "Missing remainder_type_id" });
        }

        const deleteResult = await pool.query(
            "SELECT delete_mst_remainder_type_details($1) AS result",
            [remainder_type_id]
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
        console.error("Delete remainder Details Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports={
    getMstRemainderTypeList,
    saveMstRemainderTypeDetails,
    updateMstRemainderTypeDetails,
    deleteMstRemainderTypeDetails
};