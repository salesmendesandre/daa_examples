import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { RegisterSchema, LoginSchema } from "../schemas/auth.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createToken, authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Registro
router.post("/register", validateBody(RegisterSchema), async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  const existing = await UserModel.findOne({ email }).exec();
  if (existing) {
    return res.status(409).json({ error: "El correo electrónico ya está en uso" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    email,
    passwordHash,
    fullName,
    role: "user"
  });

  const token = createToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
    fullName: user.fullName
  });

  res.status(201).json({
    message: "Usuario registrado satisfactoriamente",
    token,
    user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }
  });
});

// Login
router.post("/login", validateBody(LoginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ error: "Credenciales de acceso incorrectas" });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: "Credenciales de acceso incorrectas" });
  }

  const token = createToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
    fullName: user.fullName
  });

  res.json({
    message: "Autenticación correcta",
    token,
    user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }
  });
});

// Perfil
router.get("/me", authenticate, async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user?.userId).select("-passwordHash").exec();
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

export default router;
