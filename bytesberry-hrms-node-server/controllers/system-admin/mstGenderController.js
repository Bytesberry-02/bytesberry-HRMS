const pool = require("../../dbConfig");

const {
  saveMstGenderDetailsSchema,
  updateMstGenderDetailsSchema,
  deleteMstGenderDetailsSchema,
} = require("../../schemas/system-admin/mstGenderSchema");

const getMstGenderList = async (req, res, next) => {
  try {
    const mstGenderList = await pool.query(
      "SELECT * FROM get_mst_gender_list() as mst_gender_list;"
    );
    // console.log("mstGenderList", mstGenderList.rows);
    res.status(200).json({
      mstGenderList:
        mstGenderList.rowCount > 0 ? mstGenderList.rows[0].mst_gender_list : [],
      status: 200,
      errMsg: "",
    });
  } catch (error) {
    console.log("getMstGenderList", error);
  }
};

const saveMstGenderDetails = async (req, res, next) => {
  try {
    const schemaValidation = await saveMstGenderDetailsSchema.validateAsync(
      req.body
    );

    const { gender_name } = schemaValidation;

    const saveMstGenderDetails = await pool.query(
      "SELECT * FROM add_mst_gender_details($1)",
      [gender_name]
    );

    // console.log("saveMstGenderDetails.rows[0]", saveMstGenderDetails.rows[0]);

    if (saveMstGenderDetails.rows[0].add_mst_gender_details === "true") {
      res.status(200).json({
        saveMstGenderDetails:
          saveMstGenderDetails.rows[0].add_mst_gender_details,
        status: 200,
        errMsg: "",
      });
    } else {
      res.status(202).json({
        saveMstGenderDetails:
          saveMstGenderDetails.rows[0].add_mst_gender_details,
        status: 202,
        errMsg: "",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.isJoi === true) {
      error.status = 422;
      res.status(422).json({
        saveMstGenderDetails: {},
        status: 422,
        errMsg: error.message,
      });
    } else {
      res.status(500).json({
        saveMstGenderDetails: {},
        status: 500,
        errMsg: error.message,
      });
    }
  }
};

const updateMstGenderDetails = async (req, res, next) => {
  try {
    const schemaValidation = await updateMstGenderDetailsSchema.validateAsync(
      req.body
    );

    const { gender_name, gender_id } = schemaValidation;

    const updateMstGenderDetails = await pool.query(
      "select * from update_mst_gender_details($1,$2)",
      [gender_name, gender_id]
    );
    if (updateMstGenderDetails.rows[0].update_mst_gender_details === "true") {
      res.status(200).json({
        updateMstGenderDetails:
          updateMstGenderDetails.rows[0].update_mst_gender_details,
        status: 200,
        errMsg: "",
      });
    } else {
      res.status(202).json({
        updateCategoryDetails:
          updateMstGenderDetails.rows[0].update_mst_gender_details,
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

// const deleteMstGenderDetails = async (req, res) => {
//   const { gender_id } = req.body;

//   try {
//     const deleteMstGenderDetails = await pool.query(
//       "DELETE FROM utbl_mst_gender WHERE gender_id = $1 RETURNING *",
//       [gender_id]
//     );
//     res.json(deleteMstGenderDetails.rows[0].gender_id);
//   } catch (error) {
//     console.log("Delete Gender Master Error", error);
//   }
// };

const deleteMstGenderDetails = async (req, res) => {
  try {
    const schemaValidation = await deleteMstGenderDetailsSchema.validateAsync(
      req.body
    );

    const deleteMstGenderDetails = await pool.query(
      "SELECT * FROM delete_mst_gender_details($1)",
      [schemaValidation.gender_id]
    );
    res.json(deleteMstGenderDetails.rows[0].gender_id);
  } catch (error) {
    console.log("Delete Gender Details Error", error);
  }
};

module.exports = {
  getMstGenderList,
  saveMstGenderDetails,
  updateMstGenderDetails,
  deleteMstGenderDetails,
};
