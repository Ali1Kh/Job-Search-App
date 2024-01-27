import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as usersController from "./users.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { signUpSchema } from "./users.schema.js";
const router = Router();

router.post(
  "/signup",
  validation(signUpSchema),
  asyncHandler(usersController.signup)
);

export default router;
