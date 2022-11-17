import { Request, Response } from "express";
import {
  findAllUsers,
  findUserByEmail,
  findUserById,
} from "../services/user.service";

export const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await findAllUsers();
    res.send({ status: "OK", data: users });
  } catch (error) {
    res.status(500).send({ status: "FAILED", message: error });
  }
};

export const userByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;

  if (!email) {
    res
      .status(400)
      .send({ status: "FAILED", message: "Please type a valid email type" });
    return;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res
        .status(401)
        .send({ status: "FAILED", message: "This user doesn't exist" });
      return;
    }
    res.send({ status: "OK", data: user });
  } catch (error) {
    res.status(500).send({ status: "FAILED", message: error });
  }
};

export const userById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .send({ status: "FAILED", message: "Please type a valid email type" });
    return;
  }

  try {
    const user = await findUserById(id);
    if (!user) {
      res
        .status(401)
        .send({ status: "FAILED", message: "This user doesn't exist" });
      return;
    }
    res.send({ status: "OK", data: user });
  } catch (error) {
    res.status(500).send({ status: "FAILED", message: error });
  }
};
