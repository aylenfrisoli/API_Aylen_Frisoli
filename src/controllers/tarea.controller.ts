import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { listarTareasDeUsuario, crearTarea, actualizarTarea, eliminarTarea } from '../services/tarea.service';

// devuelve todas las tareas del usuario logueado
export const getAll = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const tareas = await listarTareasDeUsuario(req.userId as string);
  res.status(200).json(tareas);
});

// crea una tarea nueva para el usuario logueado
export const create = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const tarea = await crearTarea(req.userId as string, req.body);
  res.status(201).json(tarea);
});

// actualiza una tarea propia; si el service tira NotFoundError o ForbiddenError, asyncHandler los manda solos al error handler
export const update = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const tarea = await actualizarTarea(req.userId as string, req.params.id, req.body);
  res.status(200).json(tarea);
});

// elimina una tarea propia, misma logica de errores que update
export const remove = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  await eliminarTarea(req.userId as string, req.params.id);
  res.status(204).send();
});
