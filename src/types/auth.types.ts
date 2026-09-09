// lo que guardamos adentro del JWT, se usa tanto para firmarlo en el login como para tiparlo cuando lo decodificamos en el middleware
export interface JwtPayload {
  userId: string;
  email: string;
}

// body ya validado por el middleware validate() para POST /users/register
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

// body ya validado por el middleware validate() para POST /users/login
export interface LoginData {
  email: string;
  password: string;
}
