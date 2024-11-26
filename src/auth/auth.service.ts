//Archivo de servicios de autenticación

//Es el servicio  de autenticacion que contiene la logica para manejar el login y el register de usuarios SUPER, interactua con el UserService y utiliza JWT para generar los token que autentiquen a los usuarios

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';   //Se importa para interactuar con los datos de los usuarios
import { JwtService } from '@nestjs/jwt';   //Se utiliza para generar y firmar los tokens
import * as bcrypt from 'bcrypt';   //Biblioteca para manejar el cifrado de contraseñas
import { CreateUserDto } from 'src/user/dto/create-user.dto';   //DTO es Data Transfer Object, que define el formato de los datos que se transfieren entre el controlador y el servicio


@Injectable()   //Este decorador indica que puedeser inyectado el servicio en otros modulos
export class AuthService {
    //Inyeccion de dependencias
    constructor(
        private userService: UserService,   //Para interactuar con los datos del usuario en la DB
        private jwtService: JwtService   //Para generar tokens que seran devueltos al cliente
    ) {}



    /**
     * 
     * Este servicio realiza el login de cualquier usuario, verificando sus credenciales y generando un token
     * @param user que es del tipo CreateUserDto
     * @returns el token
     */
    async login(user: CreateUserDto) {
        //Llamamos al servicio para obtener el usuario por email
        const userRecord = await this.userService.findByEmail(user.email);   //findByEmail se encuentra en el UserService y se usa para buscar el usuario en la DB

        //Si el usuario no existe o la contraseña no coincide, devolvemos una excepción
        if (!userRecord || !(await bcrypt.compare(user.password, userRecord.password))) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }

        //Construimos el payload que se usara para firmar el token
        const payload = { 
            sub: userRecord.id, 
            email: user.email, 
            role: userRecord.role };
        
        //Devolvemos el token con el formato { access_token: token }
        return {
            access_token: this.jwtService.sign(payload),   //Se genera un token basado en el payload
        };
    }

    /**
     * Este servicio se encarga de crear un usuario SUPER
     * @param dto que es del tipo CreateUserDto
     * @returns 
     */
    async registerSuper(dto: CreateUserDto) {
        //Buscamos el usuario por email
        const user = await this.userService.findByEmail(dto.email);

        //Si el usuario ya existe, devolvemos una excepcion
        if (user) {
            throw new UnauthorizedException('Email already exists');
        }
        
        //Sino, creamos el usuario con el registerSuper del UserService
        return this.userService.registerSuper(dto);   //La contraseña ya se cifra en userService
    }
}
