import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from '../models/tarea.model';
import { Tarea } from '../types/tarea.types';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export type NuevaTareaData = Omit<Tarea, 'id' | 'userId'>;
export type ActualizarTareaData = Partial<NuevaTareaData>;

// trae las tareas del usuario logueado; si viene search, filtra ademas por titulo comparando todo en minusculas para que no importe como lo escriban
export async function listarTareasDeUsuario(userId: string, search?: string): Promise<Tarea[]> {
  const tareas = await getAllTareas();
  const tareasDelUsuario = tareas.filter((tarea) => tarea.userId === userId);

  if (!search) {
    return tareasDelUsuario;
  }

  const searchEnMinusculas = search.toLowerCase();
  return tareasDelUsuario.filter((tarea) => tarea.titulo.toLowerCase().includes(searchEnMinusculas));
}

// crea una tarea asignandole el userId del token, nunca el que venga en el body, asi nadie puede crear tareas a nombre de otro usuario
export async function crearTarea(userId: string, data: NuevaTareaData): Promise<Tarea> {
  return createTarea({ ...data, userId });
}

// actualiza una tarea, validando primero que exista y que sea del usuario que la pide antes de tocarla
export async function actualizarTarea(userId: string, id: string, data: ActualizarTareaData): Promise<Tarea> {
  const tarea = await getTareaById(id);
  if (!tarea) {
    throw new NotFoundError('Tarea no encontrada');
  }
  if (tarea.userId !== userId) {
    throw new ForbiddenError('No autorizado');
  }

  // el update ya sabemos que existe, por eso el "as Tarea" en vez de manejar el null de vuelta
  return (await updateTarea(id, data)) as Tarea;
}

// misma verificacion de existencia y pertenencia que actualizarTarea, pero elimina en vez de modificar
export async function eliminarTarea(userId: string, id: string): Promise<void> {
  const tarea = await getTareaById(id);
  if (!tarea) {
    throw new NotFoundError('Tarea no encontrada');
  }
  if (tarea.userId !== userId) {
    throw new ForbiddenError('No autorizado');
  }

  await deleteTarea(id);
}
