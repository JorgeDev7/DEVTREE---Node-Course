import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";
import { User } from "../models/User";
import { hashPassword } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: true,
        errorMessage: "Valores de creación requeridos",
        data: errors.array()
      });
      return;
    }

    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      const error = new Error(
        "Un usuario con ese correo electrónico ya esta registrado"
      );
      res.status(409).json({
        error: true,
        errorMessage: error.message
      });
      return;
    }

    const handle = slugify(req.body.handle, "");
    const handleExist = await User.findOne({ handle });
    if (handleExist) {
      const error = new Error("Nombre de usuario no disponible");
      res.status(409).json({
        error: true,
        errorMessage: error.message
      });
      return;
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle;

    const savedUser = await user.save();
    const {
      password: userPassword,
      __v,
      ...clearedData
    } = savedUser.toObject();

    res.status(201).json({
      error: false,
      message: "Usuario registrado exitosamente",
      data: clearedData
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: true,
      errorMessage: "No se pudo registrar al usuario, intentalo más tarde"
    });
  }
};
