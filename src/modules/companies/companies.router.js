import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as companiesController from "./companies.controller.js";
import { isAuth } from "../../middlewares/authintication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware..js";
import { addCompanySchema, deleteCompanySchema, updateCompanySchema } from "./companies.schema.js";
import { validation } from "../../middlewares/validation.middleware.js";
const router = Router();

router.post(
  "/addCompany",
  asyncHandler(isAuth),
  isAuthorized("hr"),
  validation(addCompanySchema),
  asyncHandler(companiesController.addCompany)
);

router.patch(
    "/updateCompany/:id",
    asyncHandler(isAuth),
    isAuthorized("hr"),
    validation(updateCompanySchema),
    asyncHandler(companiesController.updateCompany)
  );

  router.delete(
    "/deleteCompany/:id",
    asyncHandler(isAuth),
    isAuthorized("hr"),
    validation(deleteCompanySchema),
    asyncHandler(companiesController.deleteCompany)
  );

export default router;
