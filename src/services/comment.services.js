import commentModel from "../models/comment.models.js";

export const addReply = async ({
  user_id: _id,
  tweet_id: tweet_id,
  content,
}) => {
  const response = await commentModel.create({
    user_id: _id,
    tweet_id: tweet_id,
    content,
  });
  return response;
};
export const getCommentsUser = async (tweet_id) => {
  const response = await commentModel.find({ tweet_id });
  return response;
};
