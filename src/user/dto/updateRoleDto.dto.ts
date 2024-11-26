//Archivo de la clase UpdateRoleDto de usuario

//Es un DTO que se utiliza para actualizar el rol de un usuario, esta validado para que sea solo USER, ADMIN o SUPER

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateRoleDto {
    @ApiProperty({ description: 'Rol del usuario', example: 'USER' })
    @IsString()
    role: 'USER' | 'ADMIN' | 'SUPER';
}