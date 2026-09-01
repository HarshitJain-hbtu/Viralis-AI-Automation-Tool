import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().trim().min(1).max(120).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(6).max(128).required(),
    businessName: Joi.string().trim().max(160).optional().allow(''),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(1).max(120).optional(),
    avatar: Joi.string().uri().max(2048).optional().allow(''),
}).min(1);
