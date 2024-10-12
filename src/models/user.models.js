import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    date_of_birth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18;
        },
      },
    },
    emailToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: "",
    },
    website: {
      type: String,
      maxlength: 200,
      default: "",
    },
    location: {
      type: String,
      maxlength: 100,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    passwordChangeAt: {
      type: String,
      default: "",
    },
    passwordResetExpires: {
      type: String,
      default: "",
    },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);
userSchema.methods = {
  createPasswordToken: async function () {
    const passwordToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(passwordToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return passwordToken;
  },
};
const User = mongoose.model("User", userSchema);

export default User;
