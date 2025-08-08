import { model, Schema } from "mongoose";
import {
  ApprovalStatus,
  Available,
  IDriver,
  IVehicle,
  VehicleType,
} from "./driver.interface";

const vehicleInfoSchema = new Schema<IVehicle>(
  {
    type: { type: String, enum: Object.values(VehicleType), required: true },
    model: { type: String, required: true },
    builtYear: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

export const driveSchema = new Schema<IDriver>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
      required: true,
    },
    available: {
      type: String,
      enum: Object.values(Available),
      default: Available.ONLINE,
      required: true,
    },
    vehicleInfo: vehicleInfoSchema,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driveSchema);
