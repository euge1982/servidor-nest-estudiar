//Archivo del modulo de gestion de usuarios

//Define el modulo encargado de la gestion de usuarios

import { Module } from '@nestjs/common';
import { UserService } from './user.service';   //maneja la logica de la gestion de usuarios
import { UserController } from './user.controller';   //maneja las solicitudes HTTP relacionadas con la gestion de usuarios
import { PrismaModule } from 'src/prisma/prisma.module';   //Importa el modulo de prisma, que maneja la interaccion con la DB

@Module({
  imports: [PrismaModule],   //Importa el modulo de prisma para poder utilizarlo en el modulo
  controllers: [UserController],   //Controlador que maneja las solicitudes HTTP
  providers: [UserService],   //Servicio que maneja la logica de la gestion de usuarios
  exports: [UserService],   //Exporta el servicio para poder utilizarlo en otros modulos
})

export class UserModule {}
