import { Router } from "express";
import { body } from "express-validator";
import { loginUser, registerUser } from "./handlers";
import { handleInputErrors } from "./middleware/validation";

export const router = Router();

// Autenticación y Registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El nombre de usuario es obligatorio."),
  body("name").notEmpty().withMessage("El nombre es obligatorio."),
  body("email").isEmail().withMessage("El correo electrónico no es válido."),

  body("password")
    .isLength({
      min: 8
    })
    .withMessage("La contraseña es muy corta, mínimo 8 caracteres."),
  handleInputErrors,
  registerUser
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("El correo electrónico no es válido."),

  body("password").notEmpty().withMessage("La contraseña es obligatoria."),
  handleInputErrors,
  loginUser
);
