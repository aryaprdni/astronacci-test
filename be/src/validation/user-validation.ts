import Joi from 'joi';

const registerUserValidation = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    membershipTypeId: Joi.number().allow(null),
});

const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export { registerUserValidation, loginUserValidation };