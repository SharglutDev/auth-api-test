import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { userRepository } from "../controllers/auth.controller";
import { User } from "../entities/user.entity";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers["authorization"];
  console.log(`\x1b[32mbearer token : \x1b[0m${bearerToken}`);
  const accessToken = bearerToken?.split(" ")[1];
  console.log(`\x1b[36maccess token : \x1b[0m${accessToken}`);

  if (!accessToken) {
    res.status(401).send({ status: "FAILED", message: "Missing token" });
    return;
  } else {
    const payload: any = verify(accessToken, "access_secret");

    if (!payload) {
      res.status(401).send({ status: "FAILED", message: "Unauthorized token" });
      return;
    }

    const user = await userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      res.status(404).send({ status: "FAILED", message: "User doesn't exist" });
    }

    // res.send({ status: "OK", message: "Authorization granted" });

    next();
  }
};
