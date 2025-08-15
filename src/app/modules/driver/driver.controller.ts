import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const driverRequest = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const driverReq = await DriverServices.driverRequest(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Driver requested successfully",
      data: driverReq,
    });
  }
);

const updateDriver = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const payload = req.body;
    const decoded = req.user;

    const updatedDriver = await DriverServices.updateDriver(
      driverId,
      payload,
      decoded
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Driver Updated Successfully",
      data: updatedDriver,
    });
  }
);

const updateApproval = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    await DriverServices.updateApproval(userId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `Driver ${req?.body?.approvalStatus as string} Successfully`,
      data: null,
    });
  }
);

export const DriverControllers = {
  driverRequest,
  updateDriver,
  updateApproval,
};
