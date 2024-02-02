import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as jobsController from "./jobs.controller.js";
import { isAuth } from "../../middlewares/authintication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware..js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  addJobSchema,
  applyToJobSchema,
  filterJobsSchema,
  updateJobSchema,
} from "./jobs.schema.js";
import { searchCompanySchema } from "../companies/companies.schema.js";
import { uploadFiles } from "../../utils/multer.js";
const router = Router();

router.post(
  "/addJob",
  asyncHandler(isAuth),
  isAuthorized("hr"),
  validation(addJobSchema),
  asyncHandler(jobsController.addJob)
);
router.patch(
  "/updateJob/:id",
  asyncHandler(isAuth),
  isAuthorized("hr"),
  validation(updateJobSchema),
  asyncHandler(jobsController.updateJob)
);

router.delete(
  "/deleteJob/:id",
  asyncHandler(isAuth),
  isAuthorized("hr"),
  asyncHandler(jobsController.deleteJob)
);

router.get("/", asyncHandler(isAuth), asyncHandler(jobsController.getJobs));

router.get(
  "/searchByCompany",
  asyncHandler(isAuth),
  validation(searchCompanySchema),
  asyncHandler(jobsController.getCompanyJobs)
);

router.get(
  "/filterJobs",
  asyncHandler(isAuth),
  validation(filterJobsSchema),
  asyncHandler(jobsController.filterJobs)
);

router.post(
  "/apply/:jobId",
  asyncHandler(isAuth),
  isAuthorized("user"),
  uploadFiles().single("resume"),
  validation(applyToJobSchema),
  asyncHandler(jobsController.applyToJob)
);

export default router;
