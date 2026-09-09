import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { registerUsuario, loginUsuario } from '../services/auth.service';

// registra un usuario nuevo y devuelve el usuario creado (sin password); si el service tira ConflictError, asyncHandler lo manda solo al error handler
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const usuario = await registerUsuario(req.body);
  res.status(201).json(usuario);
});

// loguea un usuario y devuelve el JWT si las credenciales son correctas; UnauthorizedError va tambien al error handler central
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = await loginUsuario(req.body);
  res.status(200).json({ token });
});
