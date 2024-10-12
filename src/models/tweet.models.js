import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, maxLength: 280 },
    media_urls: {
      type: String,
      default: "",
    },
    images: { type: Array },
    hashtags: { type: Array, default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes_count: { type: Number, default: 0 },
    dislikes_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
