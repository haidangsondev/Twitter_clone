import mongoose from "mongoose";
import messageModel from "../models/message.models.js";

export const sendMessageUser = async ({ sender_id, receiver_id, message }) => {
  const response = await messageModel.create({
    sender_id,
    receiver_id,
    message,
  });
  return response;
};
export const getMessageUser = async ({ sender_id, userId }) => {
  const response = await messageModel
    .find({
      $or: [
        {
          sender_id,
          receiver_id: userId,
        },
        {
          sender_id: userId,
          receiver_id: sender_id,
        },
      ],
    })
    .sort({ created_at: 1 });
  return response;
};

export const findMessageId = async (messageId) => {
  const response = await messageModel.findById({ _id: messageId });
  return response;
};
