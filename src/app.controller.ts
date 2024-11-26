// Archivo de controlador

//Es el controlador raiz de la aplicacion
//Su proposito es manejar las solicitudes HTTP dirigidas a la raiz del servidor y devolver una respuesta

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  //Inyeccion de dependencias
  constructor(private readonly appService: AppService) {}

  @Get()   //Ruta GET /
  getHello(): string {
    return this.appService.getHello();
  }
}
