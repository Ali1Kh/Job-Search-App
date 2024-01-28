import { Company } from "../../../DB/models/company.model.js";

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

export const deleteCompany = async (req, res, next) => {
  let isCompany = await Company.findById(req.params.id);
  if (!isCompany) return next(new Error("Company Not Found"));
  if (isCompany.companyHR.toString() != req.user._id.toString())
    return next(new Error("You Must Be The HR of The company"));
  await Company.deleteOne({ _id: isCompany._id });
  return res.json({ success: true, message: "Company Deleted Successfully" });
};

