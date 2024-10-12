import tweetModel from "../models/tweet.models.js";

export const addTweet = async (newTweet) => {
  const response = await tweetModel.create(newTweet);
  return response;
};
export const getTweetById = async (tweet_id) => {
  const response = await tweetModel.findById({ _id: tweet_id });
  return response;
};
export const updateTweetById = async (tweet_id, updatedTweetData) => {
  const response = await tweetModel.findByIdAndUpdate(
    tweet_id,
    updatedTweetData,
    { new: true }
  );
  return response;
};
export const deleteTweetById = async (tweet_id) => {
  const response = await tweetModel.findByIdAndDelete(tweet_id);
  return response;
};

export const updateTweetLikesDislikes = async ({
  tweet_id,
  likes,
  dislikes,
  likes_count,
  dislikes_count,
}) => {
  await tweetModel.findByIdAndUpdate(
    tweet_id,
    { likes, dislikes, likes_count, dislikes_count },
    { new: true }
  );
};
