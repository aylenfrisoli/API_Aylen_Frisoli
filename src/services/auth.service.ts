import jwt from 'jsonwebtoken';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getUsuarioByEmail, createUsuario } from '../models/usuario.model';
import { UsuarioPublico } from '../types/usuario.types';
import { RegisterData, LoginData, JwtPayload } from '../types/auth.types';
import { ConflictError, UnauthorizedError } from '../utils/errors';

const scrypt = promisify(scryptCallback);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

// hashea la password con un salt aleatorio propio (crypto nativo de Node, sin libreria externa) y guarda "salt:hash" en hex
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

// separa el salt guardado, recalcula el hash con la password recibida y compara con timingSafeEqual (evita timing attacks)
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashGuardadoHex] = stored.split(':');
  const hashGuardado = Buffer.from(hashGuardadoHex, 'hex');
  const hashIngresado = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return timingSafeEqual(hashGuardado, hashIngresado);
}

// registra un usuario nuevo: chequea que el email no este usado, hashea el password y lo guarda (data ya viene validada por el middleware validate())
export async function registerUsuario(data: RegisterData): Promise<UsuarioPublico> {
  // normalizamos el email a minusculas aca, en el mismo punto donde entra, asi tanto el guardado como la busqueda quedan case-insensitive sin tocar el modelo
  const email = data.email.toLowerCase();

  const usuarioExistente = await getUsuarioByEmail(email);
  if (usuarioExistente) {
    throw new ConflictError('El email ya está registrado');
  }

  const passwordHasheado = await hashPassword(data.password);
  const usuario = await createUsuario({
    nombre: data.nombre,
    email,
    password: passwordHasheado,
  });

  // sacamos el password antes de devolver el usuario, nunca deberia salir de aca
  const { password, ...usuarioPublico } = usuario;
  return usuarioPublico;
}

// loguea un usuario: si el email o el password no coinciden tira siempre el mismo error generico, asi no le damos pistas a quien intenta adivinar
export async function loginUsuario(data: LoginData): Promise<string> {
  // mismo criterio que en el registro: comparamos siempre en minusculas para que el login no dependa de como escribieron el email
  const usuario = await getUsuarioByEmail(data.email.toLowerCase());
  if (!usuario) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const passwordValido = await verifyPassword(data.password, usuario.password);
  if (!passwordValido) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const payload: JwtPayload = { userId: usuario.id, email: usuario.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return token;
}
