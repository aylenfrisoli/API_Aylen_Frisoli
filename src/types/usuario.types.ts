export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
}

export type UsuarioPublico = Omit<Usuario, 'password'>;
