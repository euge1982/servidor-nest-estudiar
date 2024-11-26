// Configuración de la base de datos

//Define la configuracion para conectar la aplicacion con la base de datos usando Prisma (ORM)

//Se crea una instancia de PrismaClient que actua como la interfaz para interactuar con la base de datos

import { PrismaClient } from '@prisma/client';   //Clase generada automaticamente por Prisma basada en el schema.prisma
//Contiene un crud para realizar en las tablas de la DB

let prisma: PrismaClient;   // Variable para almacenar la instancia
//Se usa para garantizar que todas las operaciones de DB usen la misma conexion

try {
    prisma = new PrismaClient();   //Inicia una conexion con la DB segun lo definido el el schema.prisma
} 
catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Termina el proceso si no se puede conectar
}

export { prisma };