const pool = require("../../dbConfig");

const getMstClientList = async (req, res, next) => {
  try {
    const mstClientList = await pool.query(
      "SELECT * FROM get_mst_client_list() as mst_client_list;"
    );

    res.status(200).json({
      mstClientList:
        mstClientList.rowCount > 0 ? mstClientList.rows[0].mst_client_list : [],
      status: 200,
      errMsg: "",
    });
  } catch (error) {
    console.log("getMstClientList Error:", error);
    res.status(500).json({
      mstClientList: [],
      status: 500,
      errMsg: error.message,
    });
  }
};

module.exports = {
  getMstClientList,
};
