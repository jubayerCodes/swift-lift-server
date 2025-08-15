/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const requestedRide = await RideServices.requestRide(payload);

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
    const updatedRide = await RideServices.cancelRide(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride Cancelled Successfully",
      data: updatedRide,
    });
  }
);

export const RideControllers = {
  requestRide,
  cancelRide,
};
