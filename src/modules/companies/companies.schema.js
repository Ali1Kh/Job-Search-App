import joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const addCompanySchema = joi
  .object({
    companyName: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{3,30}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Company Name Must be only letters, between 3 and 30 characters.",
      }),
    description: joi.string().min(20).required().messages({
      "string.min": "Description Cannot be less than 20 Characters",
    }),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi
      .array()
      .length(2)
      .items(joi.number().required())
      .required(),
    companyEmail: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
  })
  .required();

export const updateCompanySchema = joi
  .object({
    id: joi.custom(ObjectIdValidate).required(),
    companyName: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).messages({
      "string.pattern.base":
        "Company Name Must be only letters, between 3 and 30 characters.",
    }),
    description: joi.string().min(20).messages({
      "string.min": "Description Cannot be less than 20 Characters",
    }),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.array().length(2).items(joi.number().required()),
    companyEmail: joi.string().email().messages({
      "string.email": "Please Enter Valid Email",
    }),
  })
  .required();

export const deleteCompanySchema = joi
  .object({
    id: joi.custom(ObjectIdValidate).required(),
  })
  .required();

export const searchCompanySchema = joi
  .object({
    name: joi.string().required(),
  })
  .required();

export const getCompanyDataSchema = joi
  .object({
    id: joi.custom(ObjectIdValidate).required(),
  })
  .required();

export const applicationToExcelSchema = joi
  .object({
    companyId: joi.custom(ObjectIdValidate).required(),
    date:joi.date().required()
  })
  .required();
