import asyncHandler from "express-async-handler";
import {
  changePasswordProfile,
  getUserProfile,
  updateUserProfile,
} from "../services/user.services.js";
import { hashPasswrod } from "../utils/password.js";
import {
  findMessageId,
  sendMessageUser,
} from "../services/message.services.js";
import {
  createFollower,
  deleteFollower,
  getFollower,
  updateFollowerCountUser,
  updateFollowingCountUser,
} from "../services/follow.services.js";
import {
  createNotification,
  getNotificationUser,
} from "../services/notification.services.js";

export const getMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const User = await getUserProfile({ _id });

  return res.status(User ? 200 : 404).json({
    success: User ? true : false,
    message: User ? "Lấy người dùng thành công" : "Không tìm thấy người dùng",
    user: User ? User : "",
  });
});

export const updateMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { username, email, date_of_birth, location, website, bio } = req.body;
  const data = { username, email, date_of_birth, location, website, bio };
  if (req.file) data.avatar = req.file.path;

  const User = await updateUserProfile({ user_id: _id, data });
  return res.status(User ? 200 : 500).json({
    success: User ? true : false,
    message: User
      ? `Cập nhật thông tin người dùng thành công`
      : "Cập nhật thông tin người dùng thất bại",
    user: User,
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { newPassword } = req.body;

  const updatedUser = await changePasswordProfile({
    user_id: _id,
    password: await hashPasswrod(newPassword),
  });

  if (!updatedUser) {
    return res.status(500).json({
      success: false,
      message: "Cập nhật mật khẩu thất bại",
    });
  }

  await createNotification({
    user_id: _id,
    type: "change-password",
    targetId: _id,
    targetModel: "User",
    description: `Thay đổi mật khẩu`,
  });

  return res.status(200).json({
    success: true,
    message: "Thay đổi mật khẩu thành công",
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { _id: sender_id } = req.user;
  const { receiver_id } = req.params;

  const newMessage = await sendMessageUser({ sender_id, receiver_id, message });

  if (!newMessage) {
    return res.status(500).json({
      success: false,
      message: "Gửi tin nhắn thất bại",
    });
  }

  res.status(201).json({
    success: true,
    message: "Tin nhắn đã được gửi thành công",
    data: newMessage,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { _id: sender_id } = req.user;

  if (!messages || messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Không có tin nhắn giữa 2 người",
    });
  }

  res.status(200).json({
    success: true,
    messages,
  });
});

// Đánh dấu tin nhắn là đã đọc
export const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params; // ID của tin nhắn
  const { _id: sender_id } = req.user; // Lấy ID người nhận từ token

  const message = await findMessageId(messageId);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy tin nhắn",
    });
  }

  // Kiểm tra xem người dùng hiện tại có phải là người nhận không
  if (message.receiver_id.toString() !== sender_id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền đánh dấu tin nhắn này",
    });
  }

  message.read = true;
  await message.save();

  res.status(200).json({
    success: true,
    message: "Tin nhắn đã được đánh dấu là đã đọc",
  });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userToFollowId } = req.params;
  const currentUserId = req.user._id;

  const existingFollow = await getFollower({
    follower_id: currentUserId,
    followed_id: userToFollowId,
  });

  if (existingFollow) {
    return res
      .status(400)
      .json({ success: false, message: "Bạn đã theo dõi người này rồi" });
  }

  await createFollower({
    follower_id: currentUserId,
    followed_id: userToFollowId,
  });

  await updateFollowerCountUser({ user_id: userToFollowId, number: 1 });
  await updateFollowingCountUser({ user_id: currentUserId, number: 1 });

  await createNotification({
    user_id: currentUserId,
    type: "follow",
    targetId: currentUserId,
    targetModel: "User",
    description: `Theo dõi người dùng: ${userToFollowId}`,
  });

  return res.status(200).json({
    success: true,
    message: `Bạn đã theo dõi thành công người dùng ${userToFollowId}`,
  });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { userToUnfollowId } = req.params;
  const currentUserId = req.user._id;

  const follow = await getFollower({
    follower_id: currentUserId,
    followed_id: userToUnfollowId,
  });

  if (!follow) {
    return res
      .status(400)
      .json({ success: false, message: "Bạn chưa theo dõi người này" });
  }

  await deleteFollower({ _id: follow._id });

  await updateFollowerCountUser({ user_id: userToUnfollowId, number: -1 });
  await updateFollowingCountUser({ user_id: currentUserId, number: -1 });

  await createNotification({
    user_id: currentUserId,
    type: "unfollow",
    targetId: currentUserId,
    targetModel: "User",
    description: `Bỏ theo dõi người dùng: ${userToUnfollowId}`,
  });

  return res.status(200).json({
    success: true,
    message: `Bạn đã hủy theo dõi người dùng ${userToUnfollowId} thành công`,
  });
});
export const getNotifications = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const notification = await getNotificationUser({ _id });
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Không có thông báo!",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Lấy thông báo thành công",
    notification,
  });
});
