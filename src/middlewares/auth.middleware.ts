import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

// extendemos Request para poder colgar el userId despues de verificar el token, asi los controllers de mas adelante lo leen directo de req
export interface AuthRequest extends Request {
  userId?: string;
}

// protege rutas: exige un Bearer token valido antes de dejar pasar a next()
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // el formato esperado es "Bearer <token>", si no viene o no tiene ese formato no hay nada que verificar
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no provisto' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
