import { model, Schema } from "mongoose";
import { ILocation, IRide, IRideStatus } from "./ride.interface";

export const locationSchema = new Schema<ILocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { versionKey: false, _id: false }
);

export const rideSchema = new Schema<IRide>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickup: locationSchema,
    destination: locationSchema,
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(IRideStatus),
      required: true,
      default: IRideStatus.REQUESTED,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
