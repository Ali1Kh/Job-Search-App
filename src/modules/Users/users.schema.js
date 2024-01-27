import joi from "joi";

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
    status: joi
      .string()
      .uppercase()
      .valid("ONLINE", "OFFLINE")
      .required()
      .messages({
        "any.only": "Status Must Be One Of (ONLINE,OFFLINE)",
      }),
  })
  .required();
