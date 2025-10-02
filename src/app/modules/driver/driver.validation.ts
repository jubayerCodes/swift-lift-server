import z from "zod";
import { ApprovalStatus, Available, VehicleType } from "./driver.interface";

export const driverRequestZodSchema = z.object({
  userId: z.string(),
  vehicleInfo: z.object({
    type: z.enum(Object.values(VehicleType)),
    model: z.string(),
    builtYear: z.string(),
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const availableSchema = z.object({
  available: z.enum(Object.values(Available)).optional(),
});

export const updateDriverZodSchema = z.object({
  approvalStatus: z.enum(Object.values(ApprovalStatus)).optional(),
  available: availableSchema,
  vehicleInfo: z
    .object({
      type: z.enum(Object.values(VehicleType)),
      model: z.string(),
      builtYear: z.string(),
    })
    .optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});
