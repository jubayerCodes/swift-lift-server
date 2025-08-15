/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const decoded = req.user;

    const updatedUser = await UserServices.updateUser(userId, payload, decoded);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  }
);

const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    await UserServices.blockUser(userId, payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Active Status Updated",
      data: null,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    await UserServices.deleteUser(userId, payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `User ${
        payload?.isDeleted ? "Deleted" : "Recovered"
      } Successfully`,
      data: null,
    });
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  blockUser,
  deleteUser,
};
