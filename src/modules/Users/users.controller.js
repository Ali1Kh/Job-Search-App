import { User } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
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

export const deleteAcc = async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  return res.json({ success: true, message: "User Deleted Successfully" });
};

export const getAccData = async (req, res, next) => {
  let user = await User.findById(req.user._id).select("-password");
  return res.json({ success: true, user });
};

export const getUserAccData = async (req, res, next) => {
  let user = await User.findById(req.params.id).select(
    "-password -recoveryEmail -__v -_id"
  );
  return res.json({ success: true, user });
};

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

export const getAccsRecoveryEmail = async (req, res, next) => {
  let users = await User.find({ recoveryEmail: req.body.recoveryEmail }).select(
    "-password -recoveryEmail -__v -_id"
  );
  return res.json({ success: true, users });
};
