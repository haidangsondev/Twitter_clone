import Joi from "joi";

const baseSchema = {
  email: Joi.string()
    .email()
    .messages({
      "string.email": "Email không hợp lệ.",
    })
    .required()
    .messages({
      "any.required": "Email là bắt buộc.",
    }),

  password: Joi.string()
    .min(8)
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự.",
    })
    .required()
    .messages({
      "any.required": "Mật khẩu là bắt buộc.",
    }),
};

const registerFields = {
  username: Joi.string()
    .min(5)
    .messages({
      "string.min": "Tên người dùng phải có ít nhất 5 ký tự.",
    })
    .max(15)
    .messages({
      "string.max": "Tên người dùng không được vượt quá 15 ký tự.",
    })
    .required()
    .messages({
      "any.required": "Tên người dùng là bắt buộc.",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp.",
    })
    .required()
    .messages({
      "any.required": "Xác nhận mật khẩu là bắt buộc.",
    }),

  date_of_birth: Joi.date()
    .less("now")
    .messages({
      "date.less": "Ngày sinh phải trước ngày hiện tại.",
    })
    .required()
    .messages({
      "any.required": "Ngày sinh là bắt buộc.",
    }),
};

const forgotPasswordFields = {
  email: Joi.string()
    .email()
    .messages({
      "string.email": "Email không hợp lệ.",
    })
    .required()
    .messages({
      "any.required": "Email là bắt buộc.",
    }),
};
const resetPasswordFields = {
  password: Joi.string()
    .min(8)
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự.",
    })
    .required()
    .messages({
      "any.required": "Mật khẩu là bắt buộc.",
    }),
  tokenPassword: Joi.string().required().messages({
    "any.required": "Token password là bắt buộc.",
  }),
};
const getValidationSchema = (type) => {
  if (type === "register") {
    return Joi.object({
      ...baseSchema,
      ...registerFields,
    });
  }

  if (type === "login") return Joi.object(baseSchema);
  if (type === "forgot-password") return Joi.object(forgotPasswordFields);
  if (type === "reset-password") return Joi.object(resetPasswordFields);
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
