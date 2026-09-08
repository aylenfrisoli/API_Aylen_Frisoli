import { promises as fs } from 'fs';

// lee un json y lo devuelve como array tipado, generico para poder usarlo con tareas, usuarios o lo que sea
export async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const contenido = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(contenido) as T[];
  } catch (error) {
    // si el archivo no existe todavia no es un error de verdad, para nosotros es lo mismo que "no hay datos"
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// escribe el array completo en el archivo, pisa todo lo que hubiera antes (con indent de 2 para que se pueda leer a mano si hace falta)
export async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
