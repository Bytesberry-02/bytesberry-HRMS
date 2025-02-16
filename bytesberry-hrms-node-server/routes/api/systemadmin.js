const express = require("express");
const router = express.Router();

// Importing controllers
const mstGenderController = require("../../controllers/system-admin/mstGenderController");
const mstRemainderTypeController = require("../../controllers/system-admin/mstRemainderTypeController")

// Master Gender Routes
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

//Master Remainder Types Routes
router
  .route("/masterRemainderTypeConfig")
  .get(mstRemainderTypeController.getMstRemainderTypeList)
  .post(mstRemainderTypeController.saveMstRemainderTypeDetails);

router
  .route("/masterRemainderTypeConfig/update")
  .post(mstRemainderTypeController.updateMstRemainderTypeDetails);

router
  .route("/masterRemainderTypeConfig/delete")
  .post(mstRemainderTypeController.deleteMstRemainderTypeDetails);
  

module.exports = router;
