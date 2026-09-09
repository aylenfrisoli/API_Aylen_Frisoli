// lo que guardamos adentro del JWT, se usa tanto para firmarlo en el login como para tiparlo cuando lo decodificamos en el middleware
export interface JwtPayload {
  userId: string;
  email: string;
}
