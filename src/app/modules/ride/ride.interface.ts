import { Types } from "mongoose";

export interface ILocation {
  latitude: number;
  longitude: number;
}

export enum IRideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IRide {
  _id?: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId: Types.ObjectId;
  pickup: ILocation;
  destination: ILocation;
  cost: number;
  status: IRideStatus;
}
