export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
}

// usuario sin el password, para nunca devolverlo en las respuestas de la API
export interface UsuarioPublico {
  id: string;
  nombre: string;
  email: string;
}

// datos para crear un usuario nuevo, el id lo genera el modelo
export interface NuevoUsuarioData {
  nombre: string;
  email: string;
  password: string;
}
