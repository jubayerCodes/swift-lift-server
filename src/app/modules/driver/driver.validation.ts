import z from "zod";
import { VehicleType } from "./driver.interface";

export const driverRequestZodSchema = z.object({
  userId: z.string(),
  vehicleInfo: z.object({
    type: z.enum(Object.values(VehicleType)),
    model: z.string(),
    builtYear: z.string(),
  }),
});
