import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "normal",
        "dislike",
        "follow",
        "unfollow",
        "create_tweet",
        "reply_tweet",
        "change_password",
      ],
      required: true,
    },
    targetId: {
      type: mongoose.Types.ObjectId,
      refPath: "targetModel",
      required: true,
    },
    targetModel: {
      type: String,
      enum: ["Tweet", "User"],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
