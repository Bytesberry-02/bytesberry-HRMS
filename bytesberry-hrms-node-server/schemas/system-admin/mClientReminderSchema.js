const Joi = require("@hapi/joi");

const saveReminderDetailsSchema = Joi.object({
  client_id: Joi.number().required(), // If client_id is numeric, change to Joi.number()
  reminder_type_id: Joi.number().required(), // Fixed typo (was remainder_type_id)
  plan_id: Joi.number().required(), // NEW: Required for plan-based calculation
  reminder_type_expiry_date: Joi.date().optional().allow(null), // Optional since it's calculated from plan
  reminder_type_renewal_date: Joi.date().optional().allow(null),
  admin_remarks: Joi.string().allow(null, ""),
  status:Joi.string().optional().allow(null,""),
});

const updateReminderDetailsSchema = Joi.object({
  reminder_details_id: Joi.number().required(),
  client_id: Joi.number().required(), // Ensure this matches DB type
  reminder_type_id: Joi.number().required(), // Fixed typo
  plan_id: Joi.number().required(), // NEW: Required for plan-based calculation
  reminder_type_expiry_date: Joi.date().optional().allow(null), // Optional since it's calculated from plan
  reminder_type_renewal_date: Joi.date().optional().allow(null),
  is_addressed: Joi.boolean().optional(), // Optional since it's calculated automatically
  admin_remarks: Joi.string().allow(null, ""),
  status:Joi.string().allow(null,""),
});

const deleteReminderDetailsSchema = Joi.object({
  reminder_details_id: Joi.number().required(),
});

module.exports = {
  saveReminderDetailsSchema,
  updateReminderDetailsSchema,
  deleteReminderDetailsSchema,
};