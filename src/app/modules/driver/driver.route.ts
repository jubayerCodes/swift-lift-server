import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { driverRequestZodSchema } from "./driver.validation";

export const DriverRoutes = Router();

DriverRoutes.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(driverRequestZodSchema),
  DriverControllers.driverRequest
);
