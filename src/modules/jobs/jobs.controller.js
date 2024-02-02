import { Application } from "../../../DB/models/application.model.js";
import { Job } from "../../../DB/models/job.model.js";
import cloudinary from "../../utils/cloudinary.js";
// Add Job 
export const addJob = async (req, res, next) => {
  await Job.create({ ...req.body, addedBy: req.user._id });
  return res.json({ success: true, message: "Job Added Successfully" });
};
// Update Job
export const updateJob = async (req, res, next) => {
  let isJob = await Job.findById(req.params.id);
  if (!isJob) return next(new Error("Job Not Found"));
  if (isJob.addedBy.toString() != req.user._id.toString())
    return next(new Error("You Must Be The HR of The company's job"));
  await Job.findByIdAndUpdate(isJob._id, {
    ...req.body,
  });
  return res.json({ success: true, message: "Job Updated Successfully" });
};
// Delete Job
export const deleteJob = async (req, res, next) => {
  let isJob = await Job.findById(req.params.id);
  if (!isJob) return next(new Error("Job Not Found"));
  if (isJob.addedBy.toString() != req.user._id.toString())
    return next(new Error("You Must Be The HR of The company's job"));
  await Job.deleteOne({ _id: isJob._id });
  return res.json({ success: true, message: "Job Deleted Successfully" });
};
// Get all Jobs with their company’s information.
export const getJobs = async (req, res, next) => {
  let jobs = await Job.find().populate("company");
  return res.json({ success: true, jobs });
};

// Get all Jobs for a specific company.
export const getCompanyJobs = async (req, res, next) => {
  let jobs = await Job.find().populate({
    path: "company",
    match: { companyName: req.query.name },
  });
  return res.json({
    success: true,
    jobs: jobs.filter((job) => job.company.length > 0),
  });
};
//! Get all Jobs that match the following filters  : get data in query as an array to filter on more conditions like (jobtitle = frontend or backend)
export const filterJobs = async (req, res, next) => {
  let { jobTitle, jobLocation, workingTime, seniorityLevel, technicalSkills } =
    req.query;
  let filter = {
    jobTitle: jobTitle ? { $in: jobTitle } : undefined,
    jobLocation: jobLocation ? { $in: jobLocation } : undefined,
    workingTime: workingTime ? { $in: workingTime } : undefined,
    seniorityLevel: seniorityLevel ? { $in: seniorityLevel } : undefined,
    technicalSkills: technicalSkills ? { $in: technicalSkills } : undefined,
  };
  for (const key in filter) {
    if (filter[key] === undefined) {
      delete filter[key];
    }
  }
  let jobs = await Job.find(filter).sort({});
  return res.json({ sucess: true, count: jobs.length, jobs });
};
// Apply to Job
export const applyToJob = async (req, res, next) => {
  let isJob = await Job.findById(req.params.jobId);
  if (!isJob) return next(new Error("Job not found"));
  if (!req.file) return next(new Error("Resume is Requierd"));
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `jobsApp/${req.params.jobId}/applications/${req.user._id}` }
  );

  await Application.create({
    ...req.body,
    jobId: req.params.jobId,
    userId: req.user._id,
    userResume: { secure_url, public_id },
  });

  return res.json({
    sucess: true,
    message: "Application Applied Successfully",
  });
};
