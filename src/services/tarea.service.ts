import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from '../models/tarea.model';
import { Tarea } from '../types/tarea.types';

export type NuevaTareaData = Omit<Tarea, 'id' | 'userId'>;
export type ActualizarTareaData = Partial<NuevaTareaData>;

// trae solo las tareas del usuario logueado, filtrando sobre el total que devuelve el model
export async function listarTareasDeUsuario(userId: string): Promise<Tarea[]> {
  const tareas = await getAllTareas();
  return tareas.filter((tarea) => tarea.userId === userId);
}

// crea una tarea asignandole el userId del token, nunca el que venga en el body, asi nadie puede crear tareas a nombre de otro usuario
export async function crearTarea(userId: string, data: NuevaTareaData): Promise<Tarea> {
  return createTarea({ ...data, userId });
}

// actualiza una tarea, validando primero que exista y que sea del usuario que la pide antes de tocarla
export async function actualizarTarea(userId: string, id: string, data: ActualizarTareaData): Promise<Tarea> {
  const tarea = await getTareaById(id);
  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }
  if (tarea.userId !== userId) {
    throw new Error('No autorizado');
  }

  // el update ya sabemos que existe, por eso el "as Tarea" en vez de manejar el null de vuelta
  return (await updateTarea(id, data)) as Tarea;
}

// misma verificacion de existencia y pertenencia que actualizarTarea, pero elimina en vez de modificar
export async function eliminarTarea(userId: string, id: string): Promise<void> {
  const tarea = await getTareaById(id);
  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }
  if (tarea.userId !== userId) {
    throw new Error('No autorizado');
  }

  await deleteTarea(id);
}
