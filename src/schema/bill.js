import Joi from "joi";


export const schemaBill = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    cartId: Joi.string().required(),
});