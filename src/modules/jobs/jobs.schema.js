import joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const addJobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().required(),
    softSkills: joi.array().required(),
  })
  .required();

export const updateJobSchema = joi
  .object({
    id: joi.custom(ObjectIdValidate).required(),
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array(),
    softSkills: joi.array(),
  })
  .required();

export const filterJobsSchema = joi
  .object({
    jobTitle: joi.array(),
    jobLocation: joi
      .array()
      .items(joi.string().valid("onsite", "remotely", "hybrid")),
    workingTime: joi
      .array()
      .items(joi.string().valid("part-time", "full-time")),
    seniorityLevel: joi
      .array()
      .items(
        joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      ),
    technicalSkills: joi.array().items(joi.string()),
  })
  .required();

export const applyToJobSchema = joi
  .object({
    jobId: joi.custom(ObjectIdValidate).required(),
    userTechSkills: joi.array().items(joi.string()),
    userSoftSkills: joi.array().items(joi.string()),
  })
  .required();
