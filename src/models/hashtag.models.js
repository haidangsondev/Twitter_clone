import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: String,
    tweet_ids: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);

export default Hashtag;
