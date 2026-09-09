import { z } from 'zod';

// valida los datos para registrar un usuario nuevo
export const registerSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// valida los datos para el login, el password aca solo chequea que no venga vacio (el min de 6 ya se valido al registrarse)
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
