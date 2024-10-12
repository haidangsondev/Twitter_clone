import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = asyncHandler(async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Twiter app 👻" <haidangson.dev@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  return info;
});
