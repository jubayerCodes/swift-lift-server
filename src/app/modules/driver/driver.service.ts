import AppError from "../../errorHelpers/AppError";
import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from "http-status-codes";

const driverRequest = async (payload: Partial<IDriver>) => {
  const { userId } = payload;

  const existingDriver = await Driver.findOne({ userId });

  if (existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Already Exist");
  }

  const driverReq = await Driver.create(payload);

  return driverReq;
};

export const DriverServices = {
  driverRequest,
};
