import Joi from "joi";

const changePasswordFields = {
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp",
      "any.required": "Xác nhận mật khẩu là bắt buộc",
    }),
};

const messageFields = {
  message: Joi.string().required().messages({
    "any.required": "Tin nhắn mới là bắt buộc",
  }),
};

const getValidationSchema = (type) => {
  if (type === "change-password") return Joi.object(changePasswordFields);
  if (type === "message") return Joi.object(messageFields);
};

export const validateRequest = (type) => {
  return (req, res, next) => {
    const schema = getValidationSchema(type);

    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        message: err.message,
        Trường: err.context.key, // Thêm trường bị lỗi
      }));
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
};
