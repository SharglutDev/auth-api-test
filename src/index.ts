import express from "express";
import * as dotenv from "dotenv";
import AppDataSource from "./data-source";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";

dotenv.config({ path: ".env.local" });

AppDataSource.initialize().then(async () => {
  // ***** Init Express
  const app = express();

  // ***** Get Port from .env.local
  const PORT = process.env.PORT || 8080;

  // ***** Cors Config ****
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["X-Request-With", "content-type", "authorization"],
  };

  app.use(cors(corsOptions));

  // ***** Allowing JSON *****
  app.use(express.json());

  // ***** Cookie Parser *****
  app.use(cookieParser());

  // ***** Config Static assets folder
  app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

  // ***** Config Routes *****
  app.use("/api", authRouter);
  app.use("/api", userRouter);

  // ***** Port Config ****
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}. See results on http://localhost:${PORT}`
    );
  });
});
