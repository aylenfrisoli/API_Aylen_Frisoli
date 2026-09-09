import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { getUsuarioByEmail, createUsuario } from '../models/usuario.model';
import { UsuarioPublico } from '../types/usuario.types';
import { JwtPayload } from '../types/auth.types';

const SALT_ROUNDS = 10;

// registra un usuario nuevo: valida los datos, chequea que el email no este usado, hashea el password y lo guarda
export async function registerUsuario(data: unknown): Promise<UsuarioPublico> {
  const parsed = registerSchema.parse(data);

  const usuarioExistente = await getUsuarioByEmail(parsed.email);
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  const passwordHasheado = await bcrypt.hash(parsed.password, SALT_ROUNDS);
  const usuario = await createUsuario({
    nombre: parsed.nombre,
    email: parsed.email,
    password: passwordHasheado,
  });

  // sacamos el password antes de devolver el usuario, nunca deberia salir de aca
  const { password, ...usuarioPublico } = usuario;
  return usuarioPublico;
}

// loguea un usuario: si el email o el password no coinciden tira siempre el mismo error generico, asi no le damos pistas a quien intenta adivinar
export async function loginUsuario(data: unknown): Promise<string> {
  const parsed = loginSchema.parse(data);

  const usuario = await getUsuarioByEmail(parsed.email);
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const passwordValido = await bcrypt.compare(parsed.password, usuario.password);
  if (!passwordValido) {
    throw new Error('Credenciales inválidas');
  }

  const payload: JwtPayload = { userId: usuario.id, email: usuario.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return token;
}
