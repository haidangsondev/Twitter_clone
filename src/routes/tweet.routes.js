import {
  createTweet,
  deleteTweet,
  dislikeTweet,
  getComments,
  likeTweet,
  replyToTweet,
  updateTweet,
} from "../controllers/tweet.controllers.js";
import uploadCloud from "../utils/cloudinary.js";
import { verifyAccessToken } from "../utils/jwt.js";
import express from "express";

const tweetRouter = express.Router();

tweetRouter.post(
  "/",
  verifyAccessToken,
  uploadCloud.fields([{ name: "images", maxCount: 10 }]),
  createTweet
);
tweetRouter.put(
  "/:tweet_id",
  verifyAccessToken,
  uploadCloud.fields([{ name: "images", maxCount: 10 }]),
  updateTweet
);
tweetRouter.delete("/:tweet_id", verifyAccessToken, deleteTweet);
tweetRouter.post("/:tweet_id/like", verifyAccessToken, likeTweet);
tweetRouter.post("/:tweet_id/dislike", verifyAccessToken, dislikeTweet);
tweetRouter.post("/:tweet_id/reply", verifyAccessToken, replyToTweet);
tweetRouter.get("/:tweet_id", verifyAccessToken, getComments);

export default tweetRouter;
