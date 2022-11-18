import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import bcryptjs from "bcryptjs";
import AppDataSource from "../data-source";
import { sign, verify } from "jsonwebtoken";

export const userRepository = AppDataSource.getRepository(User);

export const Register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  console.log(`email : ${email}, password : ${password}`);

  if (!email && !password && !role) {
    res.status(400).send({ status: "FAILED", message: "Missing Parameter" });
    return;
  }

  try {
    const user = await userRepository.save({
      email,
      password: await bcryptjs.hash(password, 12),
      role,
    });

    res.send({
      status: "OK",
      message: "User successfully registered",
      data: user,
    });
  } catch (error: any) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", message: error?.message || error });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).send({
      status: "FAILED",
      message: "Invalid Credentials: this email doesn't exist",
    });
  }

  if (!(await bcryptjs.compare(password, user.password))) {
    return res.status(400).send({
      status: "FAILED",
      message: "Invalid Credentials: wrong password",
    });
  }

  const accessToken = sign(
    {
      id: user.id,
    },
    "access_secret",
    { expiresIn: 60 * 60 }
  );

  const refreshToken = sign(
    {
      id: user.id,
    },
    "refresh_secret",
    { expiresIn: 24 * 60 * 60 }
  );

  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.send({
    status: "OK",
    message: "User successfully logged",
    data: { accessToken: accessToken, refreshToken: refreshToken },
  });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  try {
    // const accessToken = req.cookies["accessToken"];
    console.log(req.headers);
    const bearerToken = req.headers["authorization"];
    console.log("\x1b[32mbearer token : \x1b[0m", bearerToken);
    const accessToken = bearerToken?.split(" ")[1];
    console.log("\x1b[36macces token : \x1b[0m", accessToken);

    if (accessToken) {
      const payload: any = verify(accessToken, "access_secret");

      if (!payload) {
        return res.status(401).send({
          status: "FAILED",
          message: "Unauthenticated - You don't have the access",
        });
      }

      const user = await userRepository.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        return res.status(401).send({
          status: "OK",
          message: "Unauthenticated - This user doesn't exist",
        });
      }

      const { password, ...data } = user;

      res.send({
        status: "OK",
        message: "Congrats, you have access to this page",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "FAILED",
      message: "Unauthenticated",
    });
  }
};

export const Refresh = async (req: Request, res: Response) => {
  try {
    // const refreshToken = req.cookies["refreshToken"];
    const bearerRefreshToken = req.headers["authorization"];
    console.log("\x1b[32mbearer token : \x1b[0m", bearerRefreshToken);
    const refreshToken = bearerRefreshToken?.split(" ")[1];
    console.log("\x1b[36mbearer token : \x1b[0m", refreshToken);

    if (refreshToken) {
      const payload: any = verify(refreshToken, "refresh_secret");

      if (!payload) {
        return res.status(401).send({
          status: "FAILED",
          message: "Unauthenticated",
        });
      }

      const accessToken = sign(
        {
          id: payload.id,
        },
        "access_secret",
        { expiresIn: 60 * 60 }
      );

      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 1000,
      // });

      res.send({
        status: "OK",
        message: "success",
        data: { accessToken: accessToken },
      });
    }
  } catch (error) {
    return res.status(401).send({
      status: "FAILED",
      message: "Unauthenticated",
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });
};
