//utbl_mst_remainder_type
const Joi = require('@hapi/joi');


const saveMstRemainderTypeDetailsSchema= Joi.object({
    remainder_type_name:Joi.string().required(),
});

const updateMstRemainderTypeDetailsSchema=Joi.object({
    remainder_type_name:Joi.string().required(),
    remainder_type_id:Joi.number().required(),
});

const deleteMstRemainderTypeDetailsSchema=Joi.object({
    remainder_type_id:Joi.number().required(),
});

module.exports={
    saveMstRemainderTypeDetailsSchema,
    updateMstRemainderTypeDetailsSchema,
    deleteMstRemainderTypeDetailsSchema,
};