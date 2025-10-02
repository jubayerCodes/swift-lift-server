/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const requestedRide = await RideServices.requestRide(payload, req.user);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Requested Successfully",
      data: requestedRide,
    });
  }
);

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedRide = await RideServices.cancelRide(req.params.id, req.user);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Cancelled Successfully",
      data: updatedRide,
    });
  }
);

const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedRide = await RideServices.acceptRide(
      req.params.rideId,
      req.body,
      req.user
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      data: updatedRide,
      message: "Ride Accepted Successfully",
      success: true,
    });
  }
);

const updateRideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedRide = await RideServices.updateRideStatus(
      req.params.rideId,
      req.body,
      req.user
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      data: updatedRide,
      message: "Ride Status Updated Successfully",
      success: true,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allRides = await RideServices.getAllRides();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `All Rides Retrieved Successfully`,
      data: allRides,
    });
  }
);

export const RideControllers = {
  requestRide,
  cancelRide,
  acceptRide,
  updateRideStatus,
  getAllRides,
};
