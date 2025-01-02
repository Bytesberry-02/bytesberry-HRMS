//Table: utbl_mst_gender

const Joi = require("@hapi/joi");

const saveMstGenderDetailsSchema = Joi.object({
  gender_name: Joi.string().required(),
});

const updateMstGenderDetailsSchema = Joi.object({
  gender_name: Joi.string().required(),
  gender_id: Joi.number().required(),
});

const deleteMstGenderDetailsSchema = Joi.object({
  gender_id: Joi.number().required(),
});

module.exports = {
  saveMstGenderDetailsSchema,
  updateMstGenderDetailsSchema,
  deleteMstGenderDetailsSchema,
};
