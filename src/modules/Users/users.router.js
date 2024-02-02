import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as usersController from "./users.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  forgetPassSchema,
  getAccsRecoveryEmailSchema,
  getUserSchema,
  loginSchema,
  sendRestCodeSchema,
  signUpSchema,
  updateAccSchema,
  updatePassSchema,
} from "./users.schema.js";
import { isAuth } from "../../middlewares/authintication.middleware.js";
const router = Router();

router.post(
  "/signup",
  validation(signUpSchema),
  asyncHandler(usersController.signup)
);

router.post(
  "/login",
  validation(loginSchema),
  asyncHandler(usersController.login)
);

router.patch(
  "/updateAcc",
  asyncHandler(isAuth),
  validation(updateAccSchema),
  asyncHandler(usersController.updateAcc)
);

router.delete(
  "/deleteAcc",
  asyncHandler(isAuth),
  asyncHandler(usersController.deleteAcc)
);

router.get(
  "/getAccData",
  asyncHandler(isAuth),
  asyncHandler(usersController.getAccData)
);

router.get(
  "/getUserAccData/:id",
  validation(getUserSchema),
  asyncHandler(usersController.getUserAccData)
);

router.patch(
  "/updatePass",
  asyncHandler(isAuth),
  validation(updatePassSchema),
  asyncHandler(usersController.updatePass)
);

router.get(
  "/getAccsRecoveryEmail",
  validation(getAccsRecoveryEmailSchema),
  asyncHandler(usersController.getAccsRecoveryEmail)
);

router.patch(
  "/resetCode",
  validation(sendRestCodeSchema),
  asyncHandler(usersController.sendRestCode)
);

router.patch(
  "/forgetPass",
  validation(forgetPassSchema),
  asyncHandler(usersController.forgetPass)
);

export default router;
