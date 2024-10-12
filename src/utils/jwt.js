import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const signAccessToken = (user_id, type = "ACCESS_TOKEN") =>
  jwt.sign({ _id: user_id, type }, process.env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });

export const signRefreshToken = (user_id, type = "REFRESH_TOKEN") =>
  jwt.sign({ _id: user_id, type }, process.env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (!req?.headers?.authorization?.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy access token",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRETKEY, (err, decode) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Xác thực access token không thành công",
      });
    }
    req.user = decode;
    next();
  });
});

export const verifyIsAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (+role !== 2000) {
    return res.status(401).json({
      success: false,
      message: "Quyền truy cập là admin ",
    });
  }
  next();
});
