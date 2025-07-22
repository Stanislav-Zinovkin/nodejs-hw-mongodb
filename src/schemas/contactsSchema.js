import Joi from "joi";

export const createContactSchema = Joi.object({
        name: Joi.string().min(3).max(20).required().messages({
         'string.base': 'Name should be a string', 
         'string.min': 'Name should have at least {#limit} characters',
         'string.max': 'Name should have at most {#limit} characters',
         'any.required': 'Name is required',
        }),
        phoneNumber:Joi.string().min(3).max(20).required().messages({ 
         'string.min': 'Phone number should have at least {#limit} characters',
         'string.max': 'Phone number should have at most {#limit} characters',
         'any.required': 'Phone number is required', 
        }),
        email:Joi.string().email().max(50).optional().messages({
         'string.email': 'Email must be a valid email address',
         }),
        isFavourite:Joi.boolean().optional(),
        contactType:Joi.string().valid('work', 'home', 'personal').required().messages({
         'any.only': 'Contact type must be one of work, home, or personal',
          'any.required': 'Contact type is required',
        }),
           
});
export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber:Joi.string().min(3).max(20),
    email:Joi.string().email().max(50),
    isFavourite:Joi.boolean(),
    contactType:Joi.string().valid('work', 'home', 'personal'),
}).min(1);