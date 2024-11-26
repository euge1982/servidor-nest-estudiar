//Archivo de la clase dto de producto

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';   //Son decoradores para validar las propiedades de la clase
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
    //Esta clase define los atributos necesarios para crear un producto con sus validaciones
    @ApiProperty({ description: 'Nombre del producto', example: 'Laptop' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Descripción del producto', example: 'Laptop Dell 2022' })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ description: 'Imagen del producto', example: 'https://example.com/image.jpg' })
    @IsString()
    @IsOptional()
    imagen?: string;
}
