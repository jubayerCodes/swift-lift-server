import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  acceptRideZodSchema,
  requestRideZodSchema,
  updateRideStatusZodSchema,
} from "./ride.validation";
import { RideControllers } from "./ride.controller";

export const RideRoutes = Router();

RideRoutes.post(
  "/request",
  checkAuth(Role.RIDER),
  validateRequest(requestRideZodSchema),
  RideControllers.requestRide
);

RideRoutes.patch(
  "/cancel/:id",
  checkAuth(Role.ADMIN, Role.RIDER),
  RideControllers.cancelRide
);

RideRoutes.patch(
  "/accept/:rideId",
  checkAuth(Role.DRIVER),
  validateRequest(acceptRideZodSchema),
  RideControllers.acceptRide
);

RideRoutes.patch(
  "/status/:rideId",
  checkAuth(Role.DRIVER, Role.ADMIN),
  validateRequest(updateRideStatusZodSchema),
  RideControllers.updateRideStatus
);

RideRoutes.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  RideControllers.getAllRides
);
