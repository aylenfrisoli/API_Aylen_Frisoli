import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUsuarioByEmail, createUsuario } from '../models/usuario.model';
import { UsuarioPublico } from '../types/usuario.types';
import { RegisterData, LoginData, JwtPayload } from '../types/auth.types';
import { ConflictError, UnauthorizedError } from '../utils/errors';

const SALT_ROUNDS = 10;

// registra un usuario nuevo: chequea que el email no este usado, hashea el password y lo guarda (data ya viene validada por el middleware validate())
export async function registerUsuario(data: RegisterData): Promise<UsuarioPublico> {
  const usuarioExistente = await getUsuarioByEmail(data.email);
  if (usuarioExistente) {
    throw new ConflictError('El email ya está registrado');
  }

  const passwordHasheado = await bcrypt.hash(data.password, SALT_ROUNDS);
  const usuario = await createUsuario({
    nombre: data.nombre,
    email: data.email,
    password: passwordHasheado,
  });

  // sacamos el password antes de devolver el usuario, nunca deberia salir de aca
  const { password, ...usuarioPublico } = usuario;
  return usuarioPublico;
}

// loguea un usuario: si el email o el password no coinciden tira siempre el mismo error generico, asi no le damos pistas a quien intenta adivinar
export async function loginUsuario(data: LoginData): Promise<string> {
  const usuario = await getUsuarioByEmail(data.email);
  if (!usuario) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const passwordValido = await bcrypt.compare(data.password, usuario.password);
  if (!passwordValido) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const payload: JwtPayload = { userId: usuario.id, email: usuario.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return token;
}
