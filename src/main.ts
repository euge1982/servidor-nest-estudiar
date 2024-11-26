// Archivo principal

//Es el punto de entrada principal de la palicacion. Configura y arranca el servidor

import { NestFactory } from '@nestjs/core';   //Para inicializar la aplicacion NestJS
import { AppModule } from './app.module';   //Modulo principal que contiene la estructura base de la aplicacion
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';   //Se usa para realizar validaciones globales en las solicitudes entrantes basadas en el DTO
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';   //Para generar la documentación de la API
import { join } from 'path';   //Ayuda a maneja rutas de archivos de manera independiente del sistema operativo
import { NestExpressApplication } from '@nestjs/platform-express';   //Para configurar la carpeta de archivos estáticos


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);   //Se inicializa la aplicacion NestJS que usa Express como servidor HTTP
  //Habilitar CORS, permite acceder desde cualquier origen
  app.enableCors();
  //Establecer prefijo global para las rutas
  app.setGlobalPrefix('api/v1');
  //Usar ValidationsPipes global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  //Solo permitir los campos que esten en el DTO
      forbidNonWhitelisted: true,   //No permitir campos que no esten en el DTO
    })
  );

  // Configuración de la carpeta de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'),{
    prefix: '/uploads',   //Sirve los archivos estáticos desde la ruta /uploads
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de gestión de usuarios y productos')   //Título de la documentación
    .setDescription('Documentación de la API para gestión de usuarios y productos')   //Descripción de la documentación
    .setVersion('1.0')   //Versión de la documentación
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Configura la autenticación JWT
    ) // Agrega autenticación JWT en la documentación
    .build();
  
  //Crea y monta la documentación
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //Iniciar el servidor
  await app.listen(envs.PORT ?? 3000);
  console.log(`Server running on port ${envs.PORT}`);
}

bootstrap();