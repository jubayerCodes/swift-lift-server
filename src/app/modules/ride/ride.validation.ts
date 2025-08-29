import z from "zod";

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
