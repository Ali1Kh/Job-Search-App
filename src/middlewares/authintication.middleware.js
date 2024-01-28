import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
export const isAuth = async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new Error("You Must Enter Token"));
  const isToken = await Token.findOne({ token, isValid: true });
  if (!isToken) return next(new Error("Token Is Invaild"));
  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  let user = await User.findById(payload.id);
  if (!user) return next(new Error("Token was expired or deleted"));
  req.user = user;
  return next();
};