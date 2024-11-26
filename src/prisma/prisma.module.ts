//Archivo del modulo de prisma

//PrismaModule encapsula la lógica relacionada con Prisma
//Su proposito es exportar el servicio PrismaService

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({   //Organiza el modulo en 3 partes: imports, providers y exports
  providers: [   //Define los servicios que el modulo ofrece
    PrismaService
  ],
  exports: [   //Hace que el PrismaService este disponible para otros modulos que importen PrismaModule
    PrismaService
  ],
})

export class PrismaModule {}