import { User } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { sendEmail } from "../../utils/sendEmail.js";

// Sign Up
export const signup = async (req, res, next) => {
  let emailExits = await User.findOne({ email: req.body.email });
  if (emailExits) return next(new Error("Email Already Exits"));
  let phoneExits = await User.findOne({ mobileNumber: req.body.mobileNumber });
  if (phoneExits) return next(new Error("Phone Already Exits"));
  let username = req.body.firstname + req.body.lastname;
  let hashedPass = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await User.create({ ...req.body, username, password: hashedPass });
  return res.json({
    success: true,
    message: "Account Registered Successfully",
  });
};
// Sign In
export const login = async (req, res, next) => {
  const { email, mobileNumber, password } = req.body;
  let user;
  if (email) {
    user = await User.findOne({ email });
    if (!user) return next(new Error("Invaild Email"));
  } else if (mobileNumber) {
    user = await User.findOne({ mobileNumber });
    if (!user) return next(new Error("Invaild Phone Number"));
  }
  if (!bcrypt.compareSync(password, user.password))
    return next(new Error("Invaild Password"));
  user.status = "ONLINE";
  await user.save();
  let tokenData = {
    id: user._id,
  };
  if (email) {
    tokenData.email = user.email;
  } else if (mobileNumber) {
    tokenData.mobileNumber = user.mobileNumber;
  }
  let token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY);
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  return res.json({ success: true, message: "Logged In Successfully", token });
};
// update account.
export const updateAcc = async (req, res, next) => {
  let emailExits = await User.findOne({ email: req.body.email });
  if (emailExits) return next(new Error("Email Already Exits"));
  let phoneExits = await User.findOne({ mobileNumber: req.body.mobileNumber });
  if (phoneExits) return next(new Error("Phone Already Exits"));
  let username = req.body.firstname + req.body.lastname;
  await User.findByIdAndUpdate(req.user._id, {
    ...req.body,
    username,
  });
  return res.json({
    success: true,
    message: "Account Updated Successfully",
  });
};
//  Delete account
export const deleteAcc = async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  return res.json({ success: true, message: "User Deleted Successfully" });
};
// Get user account data
export const getAccData = async (req, res, next) => {
  let user = await User.findById(req.user._id).select("-password");
  return res.json({ success: true, user });
};
// Get profile data for another user
export const getUserAccData = async (req, res, next) => {
  let user = await User.findById(req.params.id).select(
    "-password -recoveryEmail -__v -_id"
  );
  return res.json({ success: true, user });
};
// Update password
export const updatePass = async (req, res, next) => {
  let checkPass = bcrypt.compareSync(
    req.body.currentPassword,
    req.user.password
  );
  if (!checkPass) return next(new Error("Invaild Current Password"));
  let hashedPassword = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
  return res.json({
    success: true,
    message: "Password Updated Successfully",
  });
};
// Get all accounts associated to a specific recovery Email
export const getAccsRecoveryEmail = async (req, res, next) => {
  let users = await User.find({ recoveryEmail: req.body.recoveryEmail }).select(
    "-password -recoveryEmail -__v -_id"
  );
  return res.json({ success: true, users });
};
// send rest code to mail to change password
export const sendRestCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User Not Found"));
  const code = randomstring.generate({ length: 5, charset: "numeric" });
  user.forgetCode = code;
  await user.save();
  let mailInfo = await sendEmail({
    to: user.email,
    subject: "Reset Account Password",
    html: `<h3>Your Reset Code is ${code}</h3>`,
  });
  if (!mailInfo) return next(new Error("Somthing Went Wrong"));
  res.json({
    success: true,
    message: "Reset Code Sent To Your Email Successfully",
  });
};
// Forget password confirm code and change pass
export const forgetPass = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User Not Found"));
  if (user.forgetCode != req.body.resetCode)
    return next(new Error("Reset Code Is Invalid"));
  user.password = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await user.save();
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  res.json({
    success: true,
    message: "Your Password Reseted Successfully",
  });
};
