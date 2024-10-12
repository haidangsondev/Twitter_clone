import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.URL_MONGODB);
    if (connect.connection === 1) {
      console.log("Database connect is successfully");
    } else {
      console.log("Database is connecting");
    }
  } catch (error) {
    console.log("Database connect is failed");
    throw new Error("Error", error);
  }
};

export default dbConnect;
