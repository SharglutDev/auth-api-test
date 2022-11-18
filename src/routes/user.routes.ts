import { Router } from "express";
import {
  allUsers,
  userByEmail,
  userById,
} from "../controllers/user.controller";
import { authenticated } from "../middlewares/authenticated";

export const userRouter = Router();

userRouter.get("/users/", authenticated, (req, res) => allUsers(req, res));
userRouter.get("/users/:email", (req, res) => userByEmail(req, res));
userRouter.get("/users/:id", (req, res) => userById(req, res));
