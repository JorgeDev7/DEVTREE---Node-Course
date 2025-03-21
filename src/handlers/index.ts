import type { Request, Response } from "express";
import slugify from "slugify";
import { User } from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
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

    const userData = await user.save();
    res.status(201).json({
      error: false,
      message: "Usuario registrado exitosamente",
      data: userData
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: true,
      errorMessage: "No se pudo registrar al usuario, intentalo más tarde"
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({
      error: true,
      errorMessage:
        "No se hayaron coincidencias para el usuario y la contraseña"
    });
    return;
  }

  const passwordMatch = await checkPassword(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({
      error: true,
      errorMessage:
        "No se hayaron coincidencias para el usuario y la contraseña"
    });
    return;
  }

  res.status(200).json({
    error: false,
    message: "Inicio de sesión exitoso",
    data: user
  });
};
