import notificationModel from "../models/notifications.models.js";

export const createNotification = async ({
  user_id,
  type,
  targetId,
  targetModel,
  description,
}) => {
  await notificationModel.create({
    user_id,
    type,
    targetId,
    targetModel,
    description,
  });
};
export const getNotificationUser = async ({ _id }) => {
  const response = await notificationModel.find({ user_id: _id });

  return response;
};
