import userModel from "../models/user.models.js";

export const getUserProfile = async ({ user_id }) => {
  const response = await userModel
    .findOne({ user_id })
    .select("-password -refreshToken -emailToken");
  return response;
};

export const updateUserProfile = async ({ user_id, data }) => {
  const response = await userModel
    .findByIdAndUpdate(user_id, data, { new: true })
    .select("-password -refreshToken")
    .select("-password -refreshToken -emailToken");
  return response;
};

export const changePasswordProfile = async ({ user_id, password }) => {
  const response = await userModel
    .findByIdAndUpdate(user_id, { password }, { new: true })
    .select("-password -refreshToken")
    .select("-password -refreshToken -emailToken");
};
