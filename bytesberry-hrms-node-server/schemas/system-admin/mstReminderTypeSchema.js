//utbl_mst_reminder_type
const Joi = require('@hapi/joi');


const saveMstReminderTypeDetailsSchema= Joi.object({
    reminder_type_name:Joi.string().required(),
});

const updateMstReminderTypeDetailsSchema=Joi.object({
    reminder_type_name:Joi.string().required(),
    reminder_type_id:Joi.number().required(),
});

const deleteMstReminderTypeDetailsSchema=Joi.object({
    reminder_type_id:Joi.number().required(),
});

module.exports={
    saveMstReminderTypeDetailsSchema,
    updateMstReminderTypeDetailsSchema,
    deleteMstReminderTypeDetailsSchema,
};