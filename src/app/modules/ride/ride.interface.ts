import { Types } from "mongoose";

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IRide {
  _id?: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId: Types.ObjectId;
  pickup: ILocation;
  destination: ILocation;
  cost: number;
}
