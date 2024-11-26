//Archivo de la clase UpdateProductoDto de producto

//Es una version modificada de la clase CreateProductoDto en la que todos sus campos son opcionales

//Permite actualizaciones parciales

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
//PartialType, un DTO existente haciendo que sus campos sean opcionales