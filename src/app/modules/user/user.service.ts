import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Provider, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const authProvider: IAuthProvider = {
    provider: Provider.CREDENTIALS,
    providerId: email as string,
  };

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Exist");
  }

  if (payload.role) {
    if (
      decodedToken.role !== Role.SUPER_ADMIN &&
      decodedToken.role !== Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (
      payload.role === Role.SUPER_ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const sensitiveFields = ["isActive", "isDeleted", "isVerified"];
  const existingSensitiveFields = sensitiveFields.some(
    (field) => field in payload
  );

  if (existingSensitiveFields) {
    if (
      decodedToken.role !== Role.SUPER_ADMIN &&
      decodedToken.role !== Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  }).select({ password: 0 });

  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  updateUser,
};
