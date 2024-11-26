//Archivo para controlar la autenticación

//Un controlador en NestJs es responsable de recibir solicitudes HTTP, procesarlas (con ayuda de servicios) y devolver una respuesta

//Delega la logica de negocio al servicio

import { Controller, UnauthorizedException, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')   //Categoriza los endpoints de este controlador en la documentación de Swagger
@Controller('auth')   //Define a la clase como controlador y especifica el prefijo de la ruta base
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Desde este método se registra un nuevo usuario SUPER
     * es solo para ese rol
     * @param dto del tipo CreateUserDto
     * @returns el registro de un usuario SUPER
     */
    @Post('register')   //Define la ruta como POST /auth/register
    @ApiOperation({ summary: 'Register a new user SUPER' })   //Describe lo que hace el endpoint
    @ApiResponse({ status: 201, description: 'User created' })   //Documenta las posibles respuestas 
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async registerSuper(
        @Body() dto: CreateUserDto   //El cuerpo de la solicitud es del tipo CreateUserDto
        ) {
            //Llamamos al registerSuper de AuthService
            return this.authService.registerSuper(dto);
    }


    /**
     * Desde este método se loguea un usuario, de cualquier rol
     * @param dto que es del tipo CreateUserDto
     * @returns una respuesta con el token
     */
    @Post('login')   //Define la ruta como POST /auth/login
    @ApiOperation({ summary: 'Login user and get JWT token' })
    @ApiResponse({ status: 200, description: 'Login successful', type: String })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: CreateUserDto) { 
        //Llamamos al login de AuthService
        const user = this.authService.login(dto);

        //Si el usuario no existe, devolvemos una excepción
        if (!user) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }

        //Devolvemos el token
        return user;
    }

}