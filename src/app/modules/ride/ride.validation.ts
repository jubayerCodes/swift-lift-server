import z from "zod";
import { IRideStatus } from "./ride.interface";

export const requestRideZodSchema = z.object({
  riderId: z.string(),
  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const acceptRideZodSchema = z.object({
  driverId: z.string(),
  status: z.enum([IRideStatus.ACCEPTED, IRideStatus.CANCELLED]),
});
