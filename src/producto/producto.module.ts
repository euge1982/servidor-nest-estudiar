//Archivo del modulo de producto

//Define el modulo encargado de la gestion de productos

import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],   //Indica que el producto.module depende de PrismaModule, y significa que tiene acceso a lo que exporta PrismaModule (por ejemplo, el servicio PrismaService)
  controllers: [ProductoController],   //Define que el controlador se encargara de manejar las solicitudes HTTP relacionadas con los productos
  providers: [ProductoService],   //Declara que el ProductoService sera el proveedor de servicios de la logica de negocio de productos
  exports: [ProductoService],   //Exporta el ProductoService para que otros modulos puedan utilizarlo
})
export class ProductoModule {}
