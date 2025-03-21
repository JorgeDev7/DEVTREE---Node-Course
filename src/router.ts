import { Router } from "express";
import { body } from "express-validator";
import { registerUser } from "./handlers";

export const router = Router();

// Autenticación y Registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El nombre de usuario es obligatorio."),
  body("name").notEmpty().withMessage("El nombre es obligatorio."),
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("El correo electrónico no es válido."),

  body("password")
    .isLength({
      min: 8
    })
    .withMessage("La contraseña es muy corta, mínimo 8 caracteres."),
  registerUser
);
