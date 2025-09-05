import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { acceptRideZodSchema, requestRideZodSchema } from "./ride.validation";
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
