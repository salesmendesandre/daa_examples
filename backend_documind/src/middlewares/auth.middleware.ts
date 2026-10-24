import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin" | "editor";
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "documind_production_jwt_secret_key";

// Verificación compartida: la usan el middleware REST y el middleware de Socket.IO
// (src/realtime/socket.ts). Lanza un error si la firma no es válida o el token ha caducado.
export const verifyToken = (token: string): TokenPayload & { exp?: number } => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload & { exp?: number };
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticación ausente o malformado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const requireRole = (...roles: Array<"user" | "admin" | "editor">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos suficientes para realizar esta acción" });
    }
    next();
  };
};

export const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });
};
