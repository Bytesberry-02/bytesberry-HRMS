const express = require("express");
const router = express.Router();

const mstGenderController = require("../../controllers/system-admin/mstGenderController");

// Master Gender

router
  .route("/masterGenderConfig")
  .get(mstGenderController.getMstGenderList)
  .post(mstGenderController.saveMstGenderDetails);

router
  .route("/masterGenderConfig/update")
  .post(mstGenderController.updateMstGenderDetails);

router
  .route("/masterGenderConfig/delete")
  .post(mstGenderController.deleteMstGenderDetails);

module.exports = router;
