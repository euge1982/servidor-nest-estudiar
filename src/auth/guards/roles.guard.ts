//Archivo para validar los roles

//Protege las rutas segun los roles definidos en el decorador @Roles

import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";   //ForbiddenException es para lanzar un error
import { CanActivate, ExecutionContext } from "@nestjs/common";   //CanActivate es una interfaz que define si una peticion puede ser procesada o no.
//ExecutionContext es una interfaz que define el contexto de una peticion
import { Reflector } from "@nestjs/core";   //Se usa para recuperar los metadatos establecidos con decoradores
import { JwtPayload } from "../jwt-payload.interface";   //Interfaz que define la estructura esperada del token

@Injectable()   //Injectable marca a la clase como un servicio que NestJS puede inyectar en otras partes del codigo
//RolesGuard hereda la funcionalidad de JwtAuthGuard, o sea que primero verifica si el token es valido y luego si el usuario tiene los roles necesarios
export class RolesGuard implements CanActivate {
  //Reflector se usa para recuperar los metadatos establecidos con decoradores
  constructor(private reflector: Reflector) {}

  //Metodo para validar los roles, se ejecuta por cada peticion entrante
  canActivate(context: ExecutionContext): boolean {
    try{
      //Metodo para validar si el endpoint es publico
      const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
      if (isPublic) {
        return true;   //Si es publico, se permite el acceso
      }

      // Método para validar los roles
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!requiredRoles) {
        return true; // Si no se requieren roles, permitir acceso
      }

      // Obtener el usuario del contexto
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtPayload;
 
      // Verificar que el usuario esté definido
      if (!user) {
        throw new UnauthorizedException('User is not authenticated');
      }
 
      // Verificar si el usuario tiene los roles necesarios
      const hasRole = requiredRoles.some((role) => role === user.role);
      if (!hasRole) {
        throw new ForbiddenException(`Access Denied: Required roles are ${requiredRoles.join(', ')}`);
      }
 
      // Si el usuario tiene los roles necesarios
      return true;

    } 
    catch (error) {
      // Manejar cualquier error inesperado
      throw error instanceof ForbiddenException || error instanceof UnauthorizedException
       ? error
       : new ForbiddenException('An error occurred during role validation');
    }    
  }
}