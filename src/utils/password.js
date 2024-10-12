import bcrypt from "bcryptjs";
const intialSalt = 10;

export const hashPasswrod = async (password) => {
  const salt = await bcrypt.genSalt(intialSalt);
  const isHassPassword = await bcrypt.hash(password, salt);
  return isHassPassword;
};

export const checkPassword = async (password, passwordData) => {
  const isCheckPassword = await bcrypt.compare(password, passwordData);
  return isCheckPassword;
};
