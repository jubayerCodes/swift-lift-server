import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  availableSchema,
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
  checkAuth(Role.ADMIN, Role.DRIVER),
  validateRequest(updateDriverZodSchema),
  DriverControllers.updateDriver
);

DriverRoutes.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateDriverZodSchema),
  DriverControllers.updateApproval
);

DriverRoutes.patch(
  "/available/:id",
  checkAuth(Role.ADMIN, Role.DRIVER),
  validateRequest(availableSchema),
  DriverControllers.updateAvailability
);

DriverRoutes.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverControllers.getAllDrivers
);
