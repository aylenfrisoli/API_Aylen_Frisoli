import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerUsuario, loginUsuario } from '../services/auth.service';

// registra un usuario nuevo y devuelve el usuario creado (sin password)
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await registerUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    // los errores de Zod son de validacion (400), el resto (ej: email ya registrado) los tratamos como conflicto (409)
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(409).json({ error: (error as Error).message });
  }
}

// loguea un usuario y devuelve el JWT si las credenciales son correctas
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const token = await loginUsuario(req.body);
    res.status(200).json({ token });
  } catch (error) {
    // aca tambien separamos validacion (400) de credenciales invalidas (401), que es el error generico que tira el service
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(401).json({ error: (error as Error).message });
  }
}
