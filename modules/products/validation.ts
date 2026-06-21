import Joi, { ValidationResult } from "joi";

export const validateCreateProduct = (obj: any): ValidationResult<any> => {
  const createProduct = Joi.object({
    title: Joi.string().min(2).required(),

    description: Joi.string().min(15).allow(""),

    media: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          url: Joi.string().uri().required(),
        }),
      )
      .unique("id")
      .unique("url"),

    category: Joi.string().allow(""),

    options: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          values: Joi.array().items(Joi.string().trim().min(1)).unique().required(),
        }),
      )
      .unique("id")
      .unique("name")
      .max(3),

    variants: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          sku: Joi.string().allow("").required(),
          price: Joi.number().allow(null).required(),
          compareAtPrice: Joi.number().allow(null).required(),
          stock: Joi.number().integer().min(0).allow(null).required(),
          images: Joi.array().items(Joi.string().trim()).unique().required(),
          primaryImage: Joi.string().allow("").required(),
          attributes: Joi.object().pattern(Joi.string(), Joi.string()).required(),
        }),
      )
      .unique("id")
      .unique("sku"),

    slug: Joi.string()
      .min(2)
      .max(80)
      .lowercase()
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required(),

    seo: Joi.object({
      title: Joi.string().max(70).allow("").required(),
      description: Joi.string().max(160).allow("").required(),
    }),

    status: Joi.string().allow(""),

    brand: Joi.string().allow(''),
    collections: Joi.array().items(Joi.string()).unique(),
    tags: Joi.array().items(Joi.string()).unique(),
  }).options({ abortEarly: false });

  return createProduct.validate(obj);
};
