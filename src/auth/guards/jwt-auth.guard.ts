//Archivo para validar el token

//Guard de autenticacion en NestJS, usado para proteger rutas que requieren autenticacion del usuario. Se basa en Passport, que es una biblioteca de autenticacion

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';   //Es un guard definido de Passport
import { Reflector } from '@nestjs/core';   //Se usa para recuperar los metadatos establecidos con decoradores
import { Observable } from 'rxjs';   //Se usa para manejar las observables en NestJS


@Injectable()
export class JwtAuthGuard extends AuthGuard
('jwt') 
//Clase que hereda de AuthGuard('jwt') que es una clase de Passport que se usa para proteger rutas con autenticacion basada en JWT
{
  constructor(private reflector: Reflector) {
    super();  //Llama al constructor de AuthGuard('jwt')
  }
   //Metodo para validar si un usuario puede acceder a una ruta o no

   //canActivate es una interfaz que define si una peticion puede ser procesada o no.
   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      // Validar si la ruta es pública
      const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
      if (isPublic) {
        return true; // Permitir acceso sin autenticación
      }

      // Si no es pública, aplicar la validación de JWT
      return super.canActivate(context);
    } 
    catch (error) {
      // Capturar errores de validación del guard y lanzarlos como UnauthorizedException
      throw new UnauthorizedException('Error validating JWT guard: ' + error.message);
    }
  }

  
  //Metodo para validar el token
  //handleRequest es un metodo que maneja la logica de validacion del token JWT
  //Se invoca automaticamente cuando se usa JwtAuthGuard
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {

    //Si hay un error o no hay un usuario
    if (err) {
      throw new UnauthorizedException('An error occurred during authentication: ' + err.message); 
    }
    //Si el usuario no existe
    if (!user) {
      // Detalles adicionales si falta el usuario o el JWT no es válido
      const details = info?.message || 'Invalid token or no token provided';
      throw new UnauthorizedException(`User authentication failed: ${details}`);
    }
    
    //Devolvemos el usuario
    return user;
  }
}