import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { listarTareasDeUsuario, crearTarea, actualizarTarea, eliminarTarea } from '../services/tarea.service';

// devuelve todas las tareas del usuario logueado, el userId sale de req.userId que lo pone verifyToken
export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tareas = await listarTareasDeUsuario(req.userId as string);
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// crea una tarea nueva para el usuario logueado
export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tarea = await crearTarea(req.userId as string, req.body);
    res.status(201).json(tarea);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// actualiza una tarea propia del usuario logueado, devuelve 404 o 403 segun lo que tire el service
export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tarea = await actualizarTarea(req.userId as string, req.params.id, req.body);
    res.status(200).json(tarea);
  } catch (error) {
    const mensaje = (error as Error).message;
    // distinguimos por el mensaje que tira el service para elegir el status correcto (esto se va a limpiar cuando haya manejo de errores centralizado)
    if (mensaje === 'Tarea no encontrada') {
      res.status(404).json({ error: mensaje });
      return;
    }
    if (mensaje === 'No autorizado') {
      res.status(403).json({ error: mensaje });
      return;
    }
    res.status(500).json({ error: mensaje });
  }
}

// elimina una tarea propia del usuario logueado, misma logica de status que update
export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    await eliminarTarea(req.userId as string, req.params.id);
    res.status(204).send();
  } catch (error) {
    const mensaje = (error as Error).message;
    if (mensaje === 'Tarea no encontrada') {
      res.status(404).json({ error: mensaje });
      return;
    }
    if (mensaje === 'No autorizado') {
      res.status(403).json({ error: mensaje });
      return;
    }
    res.status(500).json({ error: mensaje });
  }
}
