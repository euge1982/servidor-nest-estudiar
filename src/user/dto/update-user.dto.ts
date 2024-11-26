//Archivo de la clase UpdateUserDto de usuario

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

//PartialType, toma un DTO existente haciendo que sus campos sean opcionales. asi se pueden actualizar solo los campos que se elijan, sin necesidad de enviar todos los campos del objeto
