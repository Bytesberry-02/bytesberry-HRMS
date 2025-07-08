const pool = require("../../dbConfig");

const getMstPlansList = async (req, res, next) => {
  try {
    const mstPlansList = await pool.query(
      "SELECT * FROM get_mst_plans_list() as mst_plans_list;"
    );

    res.status(200).json({
      mstPlansList:
        mstPlansList.rowCount > 0 ? mstPlansList.rows[0].mst_plans_list : [],
      status: 200,
      errMsg: "",
    });
  } catch (error) {
    console.log("getMstPlansList Error:", error);
    res.status(500).json({
      mstPlansList: [],
      status: 500,
      errMsg: error.message,
    });
  }
};

module.exports = {
  getMstPlansList,
};
