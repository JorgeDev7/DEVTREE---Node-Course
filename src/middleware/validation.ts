import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: true,
      errorMessage: "Error en los datos enviados",
      data: errors.array()
    });
    return;
  }

  next();
};
