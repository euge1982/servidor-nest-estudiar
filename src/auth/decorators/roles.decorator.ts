//Decorador para roles

//Decorador: Es una funcion para gregar metadatos o logica adicional

//Este archivo define un decorador personalizado, que permite restringir el acceso a ciertas rutas en funcion del rol del usuario

import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

//SetMetadata es una funcion de NestJS que permite establecer metadatos en una clase, funcion o metodo
//SetMetadata('roles', roles) establece el valor de 'roles' en el metadato 'roles'
//Quiere decir que en la ruta los roles permitidos son los que se pasaron