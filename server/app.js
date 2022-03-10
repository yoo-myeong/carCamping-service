import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./router/auth/auth.router.js";
import storyRouter from "./router/story/story.router.js";
import heartRouter from "./router/heart/heart.router.js";
import tagRouter from "./router/tag/tag.router.js";
import * as AuthRepository from "./data/auth/auth.data.js";
import * as StoryRepository from "./data/story/story.data.js";
import * as HeartRepository from "./data/heart/heart.data.js";
import { AuthController } from "./controller/auth/auth.controller.js";
import { StoryController } from "./controller/story/story.controller.js";
import { HeartController } from "./controller/heart/heart.controller.js";
import { sequelize } from "./db/database.js";
import { config } from "./config/config.js";
import { logger } from "./config/winston.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("short", { stream: logger.stream }));

app.use("/auth", authRouter(new AuthController(AuthRepository)));
app.use("/story", storyRouter(new StoryController(StoryRepository)));
app.use("/heart", heartRouter(new HeartController(HeartRepository)));
app.use("/tag", tagRouter);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  app.listen(config.port, () => {
    logger.info(`server starts on ${config.port}...!!!`);
    setInterval(function wakeHeroku() {
      http.get(config.heroku.url);
      logger.info("stay heroku wake");
    }, 1800000);
  });
});
