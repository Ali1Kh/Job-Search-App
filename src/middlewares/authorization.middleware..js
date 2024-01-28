import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (role.toLowerCase() != req.user.role.toLowerCase())
      return next(new Error("You Don't Have Permissions"));
    next();
  });
};
