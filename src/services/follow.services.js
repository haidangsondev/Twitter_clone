import followerModel from "../models/follower.models.js";
import userModel from "../models/user.models.js";

export const getFollower = async ({ follower_id, followed_id }) => {
  const response = await followerModel.findOne({ follower_id, followed_id });
  return response;
};

export const createFollower = async ({ follower_id, followed_id }) => {
  await followerModel.create({
    follower_id,
    followed_id,
  });
};

export const updateFollowerCountUser = async ({ user_id, number }) => {
  await userModel.findByIdAndUpdate(user_id, {
    $inc: { followers_count: number },
  });
};

export const updateFollowingCountUser = async ({ user_id, number }) => {
  await userModel.findByIdAndUpdate(user_id, {
    $inc: { following_count: number },
  });
};

export const deleteFollower = async ({ _id }) => {
  await followerModel.findByIdAndDelete({ _id });
};
