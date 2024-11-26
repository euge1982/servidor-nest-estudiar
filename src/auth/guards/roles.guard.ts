//Archivo para validar los roles

//Protege las rutas segun los roles definidos en el decorador @Roles

import { ForbiddenException, Injectable } from "@nestjs/common";   //ForbiddenException es para lanzar un error
import { CanActivate, ExecutionContext } from "@nestjs/common";   //CanActivate es una interfaz que define si una peticion puede ser procesada o no.
//ExecutionContext es una interfaz que define el contexto de una peticion
import { Reflector } from "@nestjs/core";   //Se usa para recuperar los metadatos establecidos con decoradores
import { JwtAuthGuard } from './jwt-auth.guard';   //Es el guard de autenticacion basado en JWT
import { JwtPayload } from "../jwt-payload.interface";   //Interfaz que define la estructura esperada del token

@Injectable()   //Injectable marca a la clase como un servicio que NestJS puede inyectar en otras partes del codigo
//RolesGuard hereda la funcionalidad de JwtAuthGuard, o sea que primero verifica si el token es valido y luego si el usuario tiene los roles necesarios
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    //Reflector se usa para recuperar los metadatos establecidos con decoradores
    super();  //Lllama al constructor de JwtAuthGuard para validar el JWT
  }

  //Metodo para validar los roles, se ejecuta por cada peticion entrante
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    //Si no hay roles requeridos, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    //Obtiene el token
    const request = context.switchToHttp().getRequest();   //Obtiene la peticion HTTP actual desde el contexto
    const user = request.user as JwtPayload;   //Obtiene el usuario del token

    //Verifica si el usuario tiene los roles necesarios
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access Denied');
    }

    //Si el usuario tiene los roles necesarios
    return true;
  }
}