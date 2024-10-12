import {
  changePassword,
  followUser,
  getMe,
  getMessages,
  getNotifications,
  markAsRead,
  sendMessage,
  unfollowUser,
  updateMe,
} from "../controllers/user.controllers.js";
import { validateRequest } from "../middlewares/user.middleware.js";
import uploadCloud from "../utils/cloudinary.js";
import { verifyAccessToken } from "../utils/jwt.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/", verifyAccessToken, getMe);
userRouter.put("/", verifyAccessToken, uploadCloud.single("avatar"), updateMe);
userRouter.put(
  "/change-password",
  verifyAccessToken,
  validateRequest("change-password"),
  changePassword
);
userRouter.post(
  "/send/:receiver_id",
  verifyAccessToken,
  validateRequest("message"),
  sendMessage
);
userRouter.get("/conversations/:userId", verifyAccessToken, getMessages);
userRouter.put("/mark-read/:messageId", verifyAccessToken, markAsRead);
userRouter.put("/follow/:userToFollowId", verifyAccessToken, followUser);
userRouter.put("/unfollow/:userToUnfollowId", verifyAccessToken, unfollowUser);
userRouter.get("/notifications", verifyAccessToken, getNotifications);

export default userRouter;
