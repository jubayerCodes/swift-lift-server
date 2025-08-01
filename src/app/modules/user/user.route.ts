import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

export const UserRoutes = Router();

UserRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
