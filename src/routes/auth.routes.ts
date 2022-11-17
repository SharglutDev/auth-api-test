import { Router } from "express";
import {
  AuthenticatedUser,
  Login,
  Logout,
  Refresh,
  Register,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/user", AuthenticatedUser);
authRouter.post("/refresh", Refresh);
authRouter.get("/logout", Logout);

export default authRouter;
