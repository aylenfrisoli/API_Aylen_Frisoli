import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

// middleware de error de express (4 parametros, asi lo reconoce como tal): usa el statusCode del error si es de los nuestros, sino asume que es un bug y devuelve 500 generico
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
