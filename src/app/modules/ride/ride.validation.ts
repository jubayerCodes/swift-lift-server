import z from "zod";
import { IRideStatus } from "./ride.interface";

export const requestRideZodSchema = z.object({
  riderId: z.string(),
  driverId: z.string(),
  status: z.enum(Object.values(IRideStatus)).optional(),
  cost: z.number(),
  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});
