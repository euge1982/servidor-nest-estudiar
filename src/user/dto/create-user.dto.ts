//Archivo de la clase dto de usuario

//Defino un DTO(Data transfer object) que se utiliza para manejar los datos de entrada al crear un nuevo usuario
//Permite estructurar y validar los datos de entrada antes de procesarlos, asegurando que cumplan cpn los requisitos

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";   //Son decoradores, se usan para validar los datos antes de procesarlos

export class CreateUserDto {
    @ApiProperty({ description: 'Email del usuario', example: 'user@example.com' })   //Documenta las propiedades del DTO para generar la documentación automática de la API utilizando Swagger
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}