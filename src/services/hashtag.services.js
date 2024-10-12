import hashtagModel from "../models/hashtag.models.js";

export const addHashtag = async ({ hashtag, tweet_ids }) => {
  await hashtagModel.create({ hashtag, tweet_ids });
};
export const removeHashtag = async ({ hashtag, tweet_ids }) => {
  await hashtagModel.findOneAndDelete({ hashtag, tweet_ids });
};
