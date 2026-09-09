import * as path from 'path';
import { randomUUID } from 'crypto';
import { readJsonFile, writeJsonFile } from './fileStorage';
import { Usuario, NuevoUsuarioData } from '../types/usuario.types';

// misma idea que en tarea.model.ts, ruta relativa a __dirname para que funcione tanto en dev como compilado
const usuariosFilePath = path.join(__dirname, '../../data/usuarios.json');

// trae todos los usuarios registrados
export async function getAllUsuarios(): Promise<Usuario[]> {
  return readJsonFile<Usuario>(usuariosFilePath);
}

// busca un usuario por email, la vamos a necesitar para el login y para chequear que no se repita un email al registrarse
export async function getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
  const usuarios = await getAllUsuarios();
  return usuarios.find((usuario) => usuario.email === email);
}

// registra un usuario nuevo generando el id aca, el password ya deberia llegar hasheado antes de entrar a esta funcion
export async function createUsuario(data: NuevoUsuarioData): Promise<Usuario> {
  const usuarios = await getAllUsuarios();
  const nuevoUsuario: Usuario = { id: randomUUID(), ...data };
  usuarios.push(nuevoUsuario);
  await writeJsonFile(usuariosFilePath, usuarios);
  return nuevoUsuario;
}
