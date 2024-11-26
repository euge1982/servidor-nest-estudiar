// Archivo de modulo

//Es el modulo raiz de la aplicacion
//Su funcion principal es organizar e importar otros modulos que forman la estructura de la aplicacion

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';   //Controlador de la aplicacion
import { AppService } from './app.service';   //Servicio de la aplicacion
import { AuthModule } from './auth/auth.module';   //Maneja la autenticacion y la autorizacion
import { PrismaModule } from './prisma/prisma.module';   //Proporciona acceso a la DB usando Prisma (ORM)
import { ProductoModule } from './producto/producto.module';   //Gestiona las operaciones realcionadas con productos
import { UserModule } from './user/user.module';   //Gestiona los usuarios y sus operaciones


@Module({
  imports: [
    AuthModule,   //Para autenticacion y manejo de tokens
    UserModule,   //Para gestion de usuarios 
    ProductoModule,   //Para gestion de productos
    PrismaModule   //Para manejar la DB
  ],
  controllers: [
    AppController   //Controlador que responde a las rutas definidas en la raiz del servicio
  ],
  providers: [
    AppService   //Servicio que contiene la logica de la aplicacion base
  ],
})

export class AppModule {}

//AppModule actua como el nucleo que une todos los modulos y los expone al resto de la aplicacion