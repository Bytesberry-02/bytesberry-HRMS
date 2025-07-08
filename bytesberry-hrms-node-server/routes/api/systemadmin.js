const express = require("express");
const router = express.Router();

// Importing controllers
const mstGenderController = require("../../controllers/system-admin/mstGenderController");
const mstReminderTypeController = require("../../controllers/system-admin/mstReminderTypeController");
const clientReminderController = require("../../controllers/system-admin/clientReminderController");
const mstClientController = require("../../controllers/system-admin/mstClientController");
const mstPlansController = require("../../controllers/system-admin/mstPlansController");
const emailController=require("../../controllers/system-admin/emailController");
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

// Master Reminder Types Routes
router
  .route("/masterReminderTypeConfig")
  .get(mstReminderTypeController.getMstReminderTypeList)
  .post(mstReminderTypeController.saveMstReminderTypeDetails);

router
  .route("/masterReminderTypeConfig/update")
  .post(mstReminderTypeController.updateMstReminderTypeDetails);

router
  .route("/masterReminderTypeConfig/delete")
  .post(mstReminderTypeController.deleteMstReminderTypeDetails);

// Master Reminder Details Routes
router
  .route("/clientReminderConfig")
  .get(clientReminderController.getClientReminderList)
  .post(clientReminderController.saveClientReminderDetails);

router
  .route("/clientReminderConfig/update")
  .post(clientReminderController.updateClientReminderDetails);

router
  .route("/clientReminderConfig/delete")
  .post(clientReminderController.deleteClientReminderDetails);

// Master Client Routes for fetch client that is created in db to get client names only
router.route("/masterClientConfig").get(mstClientController.getMstClientList);
//Master Plans Routes to get plans 
router.route("/masterPlansConfig").get(mstPlansController.getMstPlansList);

//sendmail route
router
  .route("/sendReminderNotification")
  .post(emailController.sendReminderEmail);


module.exports = router;
