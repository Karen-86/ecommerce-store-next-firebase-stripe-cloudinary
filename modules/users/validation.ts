import Joi, { ValidationResult } from "joi";

export const validateCreateTargetUserAddress = (obj: any): ValidationResult<any> => {
  const createTargetUserAddress = Joi.object({
    country: Joi.string().min(2).required(),
    state: Joi.string().min(3).allow(""),
    city: Joi.string().min(3).required(),
    streetAddress: Joi.string().min(3).required(),
    postalCode: Joi.string().required(),
  }).options({ abortEarly: false })
  return createTargetUserAddress.validate(obj);
};
