export type Prioridad = 'baja' | 'media' | 'alta';
export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada';

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaVencimiento?: string;
  prioridad: Prioridad;
  estado: EstadoTarea;
  userId: string;
}

// datos para crear una tarea, antes de saber a que usuario pertenece
export interface NuevaTareaData {
  titulo: string;
  descripcion?: string;
  fechaVencimiento?: string;
  prioridad: Prioridad;
  estado: EstadoTarea;
}

// lo mismo que NuevaTareaData pero ya con el userId, que es lo que necesita el modelo para guardarla
export interface DatosNuevaTarea extends NuevaTareaData {
  userId: string;
}

// datos para un update, todos los campos son opcionales porque se puede mandar solo lo que cambia
export interface ActualizarTareaData {
  titulo?: string;
  descripcion?: string;
  fechaVencimiento?: string;
  prioridad?: Prioridad;
  estado?: EstadoTarea;
}
