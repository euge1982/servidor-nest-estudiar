// Interfaz para el payload del token

//JWTPayload es una interfaz que define la estructura del payload (datos) que se incluye dentro del token. Contiene informacion basica del usuario que el sistema necesita para autorizacion y autenticacion

//Ventajas: 
//1. Facilita la validacion y manipulacion del token
//2. Evita la exposicion de informacion sensible del usuario

//Cuando un usuario envia un token para autenticarse, el servidor comprueba que el token cumpla con las condiciones establecidas en la interfaz JWTPayload

export interface JwtPayload {
    email: string;
    sub: number;   //El sub (identificador principal) es el id del usuario
    role: ('USER' | 'ADMIN' | 'SUPER');   //Es un tipo de union que asegura que el rol sea uno de esos valores
  }