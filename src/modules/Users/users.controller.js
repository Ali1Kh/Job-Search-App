import { User } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
export const signup = async (req, res, next) => {
  let emailExits = await User.findOne({ email: req.body.email });
  if (emailExits) return next(new Error("Email Already Exits"));
  let phoneExits = await User.findOne({ mobileNumber: req.body.mobileNumber });
  if (phoneExits) return next(new Error("Phone Already Exits"));
  let username = req.body.firstname + req.body.lastname;
  let hashedPass = bcrypt.hashSync(
    req.body.password,
    Number(process.env.SALT_ROUND)
  );
  await User.create({ ...req.body, username, password: hashedPass });
  return res.json({
    success: true,
    message: "Account Registered Successfully",
  });
};
