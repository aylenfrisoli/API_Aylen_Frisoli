import { z } from 'zod';

// valida el body para crear una tarea, prioridad y estado tienen default para no obligar a mandarlos siempre
export const createTareaSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  prioridad: z.enum(['baja', 'media', 'alta']).optional().default('media'),
  estado: z.enum(['pendiente', 'en_progreso', 'completada']).optional().default('pendiente'),
});

// mismos campos que crear pero todos opcionales, porque en un update se puede mandar solo lo que cambia
export const updateTareaSchema = createTareaSchema.partial();
