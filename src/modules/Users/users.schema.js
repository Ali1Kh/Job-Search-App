import joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const signUpSchema = joi
  .object({
    firstname: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{3,10}$"))
      .required()
      .messages({
        "string.pattern.base":
          "First Name Must be only letters, between 3 and 10 characters.",
      }),
    lastname: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{3,10}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Last Name Must be only letters, between 3 and 10 characters.",
      }),
    // username: joi.string().required(),
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    rePassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "RePassword is Invaild",
    }),
    recoveryEmail: joi.string().email().invalid(joi.ref("email")).messages({
      "string.email": "Please Enter Valid Recovery Email",
      "any.invalid": "Recovery Email Must Be Another Email",
    }),
    dob: joi.date().required(),
    mobileNumber: joi
      .string()
      .min(11)
      .max(11)
      .pattern(new RegExp("^01[0125][0-9]{8}$"))
      .required()
      .messages({
        "string.min": "Phone Number Cannot be less than 11 Characters",
        "string.max": "Phone Number Cannot be more than 11 Characters",
        "string.pattern.base": "Please Enter Vaild Phone Number",
      }),
    role: joi.string().uppercase().valid("USER", "HR").required().messages({
      "any.only": "Role Must Be One Of (USER,HR)",
    }),
    status: joi.string().uppercase().valid("ONLINE", "OFFLINE").messages({
      "any.only": "Status Must Be One Of (ONLINE,OFFLINE)",
    }),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().allow("", null).optional().messages({
      "string.email": "Please Enter Valid Email",
    }),
    mobileNumber: joi
      .string()
      .min(11)
      .max(11)
      .pattern(new RegExp("^01[0125][0-9]{8}$"))
      .allow("", null)
      .optional()
      .messages({
        "string.min": "Phone Number Cannot be less than 11 Characters",
        "string.max": "Phone Number Cannot be more than 11 Characters",
        "string.pattern.base": "Please Enter Vaild Phone Number",
      }),
    password: joi.string().min(8).required().messages({
      "string.min": "Password is Invalid",
    }),
  })
  .xor("email", "mobileNumber")
  .messages({
    "object.xor": "You Cant Login by email and phone together.",
    "object.missing": "You Must Enter Email or Phone",
  })
  .required();

export const updateAccSchema = joi
  .object({
    firstname: joi.string().pattern(new RegExp("^[a-zA-Z]{3,10}$")).messages({
      "string.pattern.base":
        "First Name Must be only letters, between 3 and 10 characters.",
    }),
    lastname: joi.string().pattern(new RegExp("^[a-zA-Z]{3,10}$")).messages({
      "string.pattern.base":
        "Last Name Must be only letters, between 3 and 10 characters.",
    }),
    email: joi.string().email().messages({
      "string.email": "Please Enter Valid Email",
    }),
    recoveryEmail: joi.string().email().invalid(joi.ref("email")).messages({
      "string.email": "Please Enter Valid Recovery Email",
      "any.invalid": "Recovery Email Must Be Another Email",
    }),
    dob: joi.date(),
    mobileNumber: joi
      .string()
      .min(11)
      .max(11)
      .pattern(new RegExp("^01[0125][0-9]{8}$"))
      .messages({
        "string.min": "Phone Number Cannot be less than 11 Characters",
        "string.max": "Phone Number Cannot be more than 11 Characters",
        "string.pattern.base": "Please Enter Vaild Phone Number",
      }),
  })
  .required();

export const getUserSchema = joi
  .object({
    id: joi.custom(ObjectIdValidate).required(),
  })
  .required();

export const updatePassSchema = joi
  .object({
    currentPassword: joi.string().min(8).required().messages({
      "string.min": "Current Password is Invalid",
    }),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    rePassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "RePassword is Invaild",
    }),
  })
  .required();

export const getAccsRecoveryEmailSchema = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();


  export const sendRestCodeSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
  })
  .required();

export const forgetPassSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
    resetCode: joi.string().length(5).required(),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm Password must be Equal main password.",
      }),
  })
  .required();