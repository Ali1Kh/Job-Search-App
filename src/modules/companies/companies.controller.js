import { Company } from "../../../DB/models/company.model.js";
import { Application } from "../../../DB/models/application.model.js";
import ExcelJS from "exceljs";
import { Job } from "../../../DB/models/job.model.js";

// Add Company
export const addCompany = async (req, res, next) => {
  let companyExits = await Company.findOne({
    companyName: req.body.companyName,
  });
  if (companyExits) return next(new Error("Company Already Exits"));
  let companyEmailExits = await Company.findOne({
    companyEmail: req.body.companyEmail,
  });
  if (companyEmailExits) return next(new Error("Email Already Exits"));
  await Company.create({ ...req.body, companyHR: req.user._id });
  return res.json({ success: true, message: "Company Added Successfully" });
};
// Update Company
export const updateCompany = async (req, res, next) => {
  let isCompany = await Company.findById(req.params.id);
  if (!isCompany) return next(new Error("Company Not Found"));
  if (isCompany.companyHR.toString() != req.user._id.toString())
    return next(new Error("You Must Be The HR of The company"));
  if (req.body.companyName) {
    let companyExits = await Company.findOne({
      companyName: req.body.companyName,
    });
    if (companyExits) return next(new Error("Company Already Exits"));
    isCompany.companyName = req.body.companyName;
  }
  if (req.body.companyEmail) {
    let companyEmailExits = await Company.findOne({
      companyEmail: req.body.companyEmail,
    });
    if (companyEmailExits) return next(new Error("Email Already Exits"));
    isCompany.companyEmail = req.body.companyEmail;
  }
  isCompany.description = req.body.description
    ? req.body.description
    : isCompany.description;
  isCompany.industry = req.body.industry
    ? req.body.industry
    : isCompany.industry;
  isCompany.address = req.body.address ? req.body.address : isCompany.address;
  isCompany.numberOfEmployees = req.body.numberOfEmployees
    ? req.body.numberOfEmployees
    : isCompany.numberOfEmployees;

  await isCompany.save();
  return res.json({ success: true, message: "Company Updated Successfully" });
};
// Delete Company
export const deleteCompany = async (req, res, next) => {
  let isCompany = await Company.findById(req.params.id);
  if (!isCompany) return next(new Error("Company Not Found"));
  if (isCompany.companyHR.toString() != req.user._id.toString())
    return next(new Error("You Must Be The HR of The company"));
  await Company.deleteOne({ _id: isCompany._id });
  return res.json({ success: true, message: "Company Deleted Successfully" });
};
// Search for a company with a name
export const searchCompany = async (req, res, next) => {
  let companies = await Company.findOne({
    companyName: { $regex: new RegExp(`^${req.query.name}$`), $options: "i" },
  });
  return res.json({ success: true, companies });
};
// Get company data
export const getCompanyData = async (req, res, next) => {
  let companies = await Company.findById(req.params.id).populate("jobs");
  if (!companies) return next(new Error("Company not Found"));
  return res.json({ success: true, companies });
};
// Get all applications for specific Jobs
export const getApplictaions = async (req, res, next) => {
  let isJob = await Job.findById(req.params.id);
  if (!isJob) return next(new Error("Job Not Found"));
  if (isJob.addedBy.toString() != req.user._id.toString())
    return next(new Error("You Are Not The Hr of company"));
  let applications = await Application.find({
    jobId: req.params.id,
  }).populate([
    {
      path: "userId",
      select: "-_id firstname lastname username email dob mobileNumber status",
    },
    {
      path: "jobId",
      match: { addedBy: req.user._id },
    },
  ]);
  applications = applications.filter((application) => application.jobId);

  return res.json({ success: true, applications });
};
// collects the applications for a specific company on a specific day and create an Excel sheet with this data
export const applicationToExcel = async (req, res, next) => {
  let isCompany = await Company.findById(req.params.companyId);
  if (!isCompany) return next(new Error("Company Not Found"));
  if (isCompany.companyHR.toString() != req.user._id.toString())
    return next(new Error("You Are Not The Hr of company"));

  // to calc from today to tommorow time
  const startDate = new Date(req.body.date);
  const endDate = new Date(req.body.date);
  endDate.setDate(endDate.getDate() + 1);

  let applications = await Application.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate([
    {
      path: "userId",
      select: "-_id firstname lastname username email dob mobileNumber status",
    },
    {
      path: "jobId",
      match: { addedBy: req.user._id },
      populate: { path: "company", match: { _id: req.params.companyId } },
    },
  ]);
  applications = applications.filter(
    (application) => application.jobId && application.jobId.company.length > 0
  );

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");
  worksheet.columns = [
    { header: "First Name", key: "firstName", width: 15 },
    { header: "Last Name", key: "lastName", width: 15 },
    { header: "Email", key: "email", width: 20 },
    { header: "Mobile Number", key: "mobileNumber", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Job Title", key: "jobTitle", width: 20 },
    { header: "Job Location", key: "jobLocation", width: 15 },
    { header: "Working Time", key: "workingTime", width: 15 },
    { header: "Seniority Level", key: "seniorityLevel", width: 15 },
    { header: "Job Description", key: "jobDescription", width: 30 },
    { header: "Technical Skills", key: "technicalSkills", width: 30 },
    { header: "Soft Skills", key: "softSkills", width: 30 },
  ];
  // Add data to the worksheet
  applications.forEach((application) => {
    worksheet.addRow({
      firstName: application.userId.firstname,
      lastName: application.userId.lastname,
      email: application.userId.email,
      mobileNumber: application.userId.mobileNumber,
      status: application.userId.status,
      jobTitle: application.jobId.jobTitle,
      jobLocation: application.jobId.jobLocation,
      workingTime: application.jobId.workingTime,
      seniorityLevel: application.jobId.seniorityLevel,
      jobDescription: application.jobId.jobDescription,
      technicalSkills: application.jobId.technicalSkills.join(", "),
      softSkills: application.jobId.softSkills.join(", "),
    });
  });

  await workbook.xlsx.writeFile(
    `src/excel/applications_${req.params.companyId}.xlsx`
  );

  return res.json({ success: true, message: "Excel Created", applications });
};
