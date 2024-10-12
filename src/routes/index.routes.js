import { errorHandler, notFound } from "../middlewares/error.middleware.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import tweetRouter from "./tweet.routes.js";

const initialRouter = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/tweet", tweetRouter);
  app.use(notFound);
  app.use(errorHandler);
};

export default initialRouter;
