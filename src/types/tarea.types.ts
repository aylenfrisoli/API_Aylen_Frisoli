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
