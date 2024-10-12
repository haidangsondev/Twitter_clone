import userModel from "../models/user.models.js";
import { hashPasswrod } from "../utils/password.js";

export const checkEmail = async ({ email }) => {
  const response = await userModel.findOne({ email });

  return response;
};
export const checkPasswordToken = async ({ passwordResetToken }) => {
  const response = await userModel.findOne({ passwordResetToken });

  return response;
};

export const checkUserRefreshAccessToken = async ({
  user_id,
  refreshToken,
}) => {
  const response = await userModel.findOne({ user_id, refreshToken });

  return response;
};
export const registerUser = async ({
  username,
  email,
  password,
  date_of_birth,
  registerToken,
}) => {
  const user = await userModel.create({
    username,
    email,
    password: await hashPasswrod(password),
    date_of_birth: new Date(date_of_birth),
    emailToken: registerToken,
    isVerify: true,
  });

  return user;
};

export const updateUserLogin = async ({ user_id, refreshToken }) => {
  await userModel.findByIdAndUpdate(user_id, { refreshToken }, { new: true });
};
