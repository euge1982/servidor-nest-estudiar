//Archivo para validar el token

//Guard de autenticacion en NestJS, usado para proteger rutas que requieren autenticacion del usuario. Se basa en Passport, que es una biblioteca de autenticacion

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';   //Es un guard definido de Passport


@Injectable()
export class JwtAuthGuard extends AuthGuard
('jwt') 
//Clase que hereda de AuthGuard('jwt') que es una clase de Passport que se usa para proteger rutas con autenticacion basada en JWT
{
  
  //Metodo para validar el token
  //handleRequest es un metodo que maneja la logica de validacion del token JWT
  //Se invoca automaticamente cuando se usa JwtAuthGuard
  handleRequest(err, user, info) {

    //Si hay un error o no hay un usuario
    if (err) {
      throw err || new Error('Unauthorized'); 
    }
    //Si el usuario no existe
    if (!user) {
      throw new Error('User not found');
    }
    
    //Devolvemos el usuario
    return user;
  }
}