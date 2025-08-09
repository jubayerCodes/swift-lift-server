import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  driverRequestZodSchema,
  updateDriverZodSchema,
} from "./driver.validation";

export const DriverRoutes = Router();

DriverRoutes.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(driverRequestZodSchema),
  DriverControllers.driverRequest
);

DriverRoutes.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DRIVER),
  validateRequest(updateDriverZodSchema),
  DriverControllers.updateDriver
);

DriverRoutes.patch(
  "/approve/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  DriverControllers.approveDriver
);
