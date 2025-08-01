import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Provider } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

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

export const UserServices = {
  createUser,
};
