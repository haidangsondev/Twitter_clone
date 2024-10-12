import express from "express";
import {
  finalRegister,
  loginUser,
  logoutUser,
  register,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";
import { validateRequest } from "../middlewares/auth.middleware.js";
import { verifyAccessToken } from "../utils/jwt.js";
const authRouter = express.Router();

authRouter.post("/register", validateRequest("register"), register);
authRouter.get("/final-register/:register_token", finalRegister);
authRouter.post("/login", validateRequest("login"), loginUser);
authRouter.post("/logout", verifyAccessToken, logoutUser);
authRouter.post(
  "/forgot-password",
  validateRequest("forgot-password"),
  forgotPassword
);
authRouter.put(
  "/reset-password",
  validateRequest("reset-password"),
  resetPassword
);
authRouter.post("/refresh-token", verifyAccessToken, refreshAccessToken);
export default authRouter;
