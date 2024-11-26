//Archivo del modulo de autenticación

//Define el modulo encargado de la autenticacion. En NestJS, los modulos se usan para organizar la aplicacion en diferentes funcionalidades

//Esta encargado de manejar toda la autenticacion y autorizacion de los usuarios


import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';   //Es el servicio que maneja la logica de la autenticacion (validacion del usuario, creacion del token, etc)
import { AuthController } from './auth.controller';   //Es el controlador que maneja los solicitudes HTTP relacionadas con la autenticacion
import { PassportModule } from '@nestjs/passport';   //Se usa para habilitar las funcionalidades de Passport
import { JwtModule } from '@nestjs/jwt';   //Facilita la integracion con JWT
import { envs } from 'src/config';   //Se usa para acceder a las variables de entorno
import { JwtStrategy } from './jwt.strategy';   //Es la estrategia de autenticacion basada en JWT, la usara Passport
import { UserModule } from 'src/user/user.module';   //Es el modulo de gestion de usuarios
import { JwtAuthGuard } from './guards/jwt-auth.guard';   //Es el guard de autenticacion basado en JWT


@Module({   //Se usa para definir el modulo
  imports: [
    UserModule,   //Importamos el modulo de gestion de usuarios, para interactuar con los usuarios de la DB
    PassportModule,   //Activa la integracion con Passport en la aplicacion
    JwtModule.register({   //Configura el modulo de JWT
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [  
    AuthService,   //El servicio que maneja la logica de la autenticacion 
    JwtStrategy,    //La estrategia de autenticacion basada en JWT
    JwtAuthGuard   //El guard de autenticacion basado en JWT que protege las rutas
  ],
  controllers: [
    AuthController   //El controlador que maneja los solicitudes HTTP relacionadas con la autenticacion
  ],
  exports: [
    AuthService   //Se exporta para que otros modulos puedan usar el servicio
  ],
})

export class AuthModule {}