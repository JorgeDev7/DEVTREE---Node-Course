import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/User";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No autorizado");
    res.status(401).json({
      error: true,
      errorMessage: error.message
    });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("No autorizado");
    res.status(401).json({
      error: true,
      errorMessage: error.message
    });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof result === "object" && result.id) {
      const user = await User.findById(result.id).select("-password -__v");
      console.log(user);
      if (!user) {
        res.status(404).json({
          error: true,
          errorMessage: "El usuario no existe"
        });
        return;
      }

      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      errorMessage: "Token no valido"
    });
  }
};
