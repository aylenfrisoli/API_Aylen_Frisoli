import * as path from 'path';
import { randomUUID } from 'crypto';
import { readJsonFile, writeJsonFile } from './fileStorage';
import { Tarea, DatosNuevaTarea, ActualizarTareaData } from '../types/tarea.types';

// subimos 2 niveles desde __dirname para llegar a data/, asi la ruta funciona igual corriendo con ts-node desde src/ o ya compilado en backend/
const tareasFilePath = path.join(__dirname, '../../data/tareas.json');

// trae todas las tareas guardadas, sin filtrar por usuario (ese filtro se hace mas arriba, en el controller)
export async function getAllTareas(): Promise<Tarea[]> {
  return readJsonFile<Tarea>(tareasFilePath);
}

// busca una tarea puntual por id, devuelve undefined si no existe
export async function getTareaById(id: string): Promise<Tarea | undefined> {
  const tareas = await getAllTareas();
  return tareas.find((tarea) => tarea.id === id);
}

// crea una tarea nueva generando el id aca adentro, asi quien llama no tiene que preocuparse por eso
export async function createTarea(data: DatosNuevaTarea): Promise<Tarea> {
  const tareas = await getAllTareas();
  const nuevaTarea: Tarea = { id: randomUUID(), ...data };
  tareas.push(nuevaTarea);
  await writeJsonFile(tareasFilePath, tareas);
  return nuevaTarea;
}

// actualiza solo los campos que vengan en data, dejando el resto como estaba
export async function updateTarea(id: string, data: ActualizarTareaData): Promise<Tarea | null> {
  const tareas = await getAllTareas();
  const index = tareas.findIndex((tarea) => tarea.id === id);
  if (index === -1) {
    return null;
  }
  // el id va al final del spread a proposito, para que nunca se pueda pisar el id original aunque data traiga uno distinto
  const tareaActualizada: Tarea = { ...tareas[index], ...data, id };
  tareas[index] = tareaActualizada;
  await writeJsonFile(tareasFilePath, tareas);
  return tareaActualizada;
}

// borra una tarea por id, filtrando el array y volviendo a guardar
export async function deleteTarea(id: string): Promise<boolean> {
  const tareas = await getAllTareas();
  const tareasFiltradas = tareas.filter((tarea) => tarea.id !== id);
  // si el largo no cambio es porque no habia ninguna tarea con ese id, asi sabemos si se borro algo de verdad
  if (tareasFiltradas.length === tareas.length) {
    return false;
  }
  await writeJsonFile(tareasFilePath, tareasFiltradas);
  return true;
}
