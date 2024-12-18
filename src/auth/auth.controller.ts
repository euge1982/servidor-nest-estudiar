//Archivo para controlar la autenticación

//Un controlador en NestJs es responsable de recibir solicitudes HTTP, procesarlas (con ayuda de servicios) y devolver una respuesta

//Delega la logica de negocio al servicio

import { Controller, UnauthorizedException, Body, Post, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
            try {
                // Llamamos al servicio de autenticación
                return await this.authService.registerSuper(dto);
              } 
              catch (error) {
                // Manejo de errores específicos según el caso
                if (error.code === 'ER_DUP_ENTRY') {   //Si hay una entrada duplicada
                  throw new BadRequestException('Email already exists');
                }
                throw new InternalServerErrorException('An error occurred while registering the user');
              }
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
        try {
            // Llamamos al servicio
            const user = await this.authService.login(dto);
      
            // Si el usuario no existe o las credenciales son inválidas, lanzamos una excepción
            if (!user) {
              throw new UnauthorizedException('Invalid credentials (email o password)');
            }
      
            // Devolvemos el token
            return user;
          } 
          catch (error) {
            // Manejo genérico de errores para login
            if (error instanceof UnauthorizedException) {
              throw error;
            }
            throw new InternalServerErrorException('An error occurred while logging in the user');
        }
    }
}