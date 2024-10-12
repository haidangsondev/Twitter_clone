import {
  checkEmail,
  checkPasswordToken,
  checkUserRefreshAccessToken,
  registerUser,
  updateUserLogin,
} from "../services/auth.services.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/sendEmail.js";
import uniqid from "uniqid";
import { checkPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const Email = await checkEmail(email);
  if (Email) {
    throw new Error("Email đã tồn tại");
  }

  const registerToken = uniqid();
  res.cookie(
    "data_register",
    {
      ...req.body,
      registerToken,
    },
    { maxAge: 15 * 60 * 1000, httpOnly: true }
  );

  const html = `Để xác thực tài khoản email, bạn cần nhấn vào link và hiệu lực là 15 phút. Xin cảm ơn <a href="${process.env.URL_SERVER}/api/user/finalRegister/${registerToken}">Nhấn vào link</a>`;
  const subject = "Đăng ký tài khoản";

  const data = {
    email,
    subject,
    html,
  };
  await sendEmail(data);
  return res.status(200).json({
    success: true,
    message: "Kiểm tra email để xác thực tài khoản đã đăng ký",
    registerToken,
  });
});

export const finalRegister = asyncHandler(async (req, res, next) => {
  const { register_token } = req.params;
  const cookie = req.cookies?.data_register;

  if (!cookie || cookie.registerToken !== register_token) {
    res.clearCookie("data_register");
    return res.status(500).json({
      success: false,
      message: "Hết thời gian cho việc xác thực tài khoản",
    });
  }

  const { username, email, password, registerToken, date_of_birth } = cookie;
  const response = await registerUser({
    username,
    email,
    password,
    registerToken,
    date_of_birth,
  });

  res.clearCookie("dataRegister", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Xác thực tài khoản email thành công",
    user: response,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const User = await checkEmail({ email });
  if (!(User && (await checkPassword(password, User.password)))) {
    throw new Error("Email hoặc Password không hợp lệ");
  }

  const {
    password: isPassword,
    refreshToken: refresh_token,
    passwordChangeAt,
    ...userData
  } = User.toObject();
  const accessToken = signAccessToken(User._id);
  const refreshToken = signRefreshToken(User._id);

  await updateUserLogin({ user_id: User._id, refreshToken });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    accessToken,
    user: userData,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { _id } = req.user;
  if (!cookie || !cookie.refresh_token) {
    throw new Error("Không tìm thấy refresh token ");
  }
  await updateUserLogin({ user_id: _id, refreshToken: "" });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const User = await checkEmail({ email });
  if (!User) {
    throw new Error("Email không tồn tại");
  }
  const passwordResetToken = await User.createPasswordToken();
  await User.save();

  const html = `Để lấy lại mật khẩu, xin vui lòng nhân vào link này. Lưu ý hiệu lực của link chỉ có 15 phút, xin cảm ơn <a href=${process.env.URL_CLIENT}/reset-password/${passwordResetToken}>Nhấn vào đây</a>`;
  const subject = "Quên mật khẩu";

  const data = {
    email,
    html,
    subject,
  };
  await sendEmail(data);
  return res.status(200).json({
    success: true,
    message: "Kiểm tra email để xác thực cho việc cho quá trình đổi mật khẩu",
    passwordResetToken,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, tokenPassword } = req.body;

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(tokenPassword)
    .digest("hex");

  const User = await checkPasswordToken({
    passwordResetToken,
  });

  if (!User) {
    throw new Error("Người dùng không tồn tại");
  }

  User.password = password;
  User.passwordResetToken = undefined;
  User.passwordResetExpires = undefined;
  User.passwordChangeAt = Date.now();
  await User.save();

  return res.status(200).json({
    success: true,
    message: "Đổi mật khẩu thành công",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refresh_token) {
    throw new Error("Không tìm thấy refresh token ");
  }

  jwt.verify(
    cookie.refresh_token,
    process.env.JWT_SECRETKEY,
    async (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Xác thực người dùng không thành công",
        });
      }
      const User = await checkUserRefreshAccessToken({
        _id: decode._id,
        refreshToken: cookie.refresh_token,
      });
      if (!User) {
        throw new Error("Người dùng không tồn tại");
      }

      const accessToken = signAccessToken(User._id);
      return res.status(200).json({
        success: true,
        accessToken,
        message: "Xác thực ngươì dùng thành công",
      });
    }
  );
});
