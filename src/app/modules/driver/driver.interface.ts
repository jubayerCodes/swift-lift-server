import { Types } from "mongoose";

export enum VehicleType {
  BIKE = "BIKE",
  CAR = "CAR",
}

export interface IVehicle {
  type: VehicleType;
  model: string;
  builtYear: string;
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IDriver {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  approvalStatus: ApprovalStatus;
  available: boolean;
  vehicleInfo: IVehicle;
}
