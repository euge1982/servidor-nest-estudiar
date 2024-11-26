//Archivo de servicios de usuario

//Es el servicio reaponsable de gestionar las operaciones relacionadas con los usuarios

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo usuario con el rol USER (por defecto)
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error
   */
  async register(dto: CreateUserDto) {
    // Ciframos la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Creamos el usuario
    return this.prisma.usuario.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'USER',   // Establece el rol predeterminado
      }  
    });
  }

  /**
   * Crea un nuevo usuario con el rol SUPER (por defecto)
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error
   */
  async registerSuper(dto: CreateUserDto) {
    // Ciframos la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Creamos el usuario
    return this.prisma.usuario.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'SUPER',   // Establece el rol predeterminado
      }  
    });
  }

  /**
   * Se encarga de loguear un usuario
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario logueado
   */
  async login(dto: CreateUserDto) {
    // Buscamos el usuario por email
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // Si el usuario no existe, devolvemos un error
    if (!user) {
      throw new Error('User not found');
    }

    // Si la contraseña no coincide, devolvemos un error
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Devolvemos el usuario
    return user;
  }

  /**
   * Este metodo se encarga de buscar un usuario por email
   * @param email 
   * @returns el usuario con ese email o un error
   */
  async findByEmail(email: string) {
    // Buscamos el usuario por email y lo devolvemos
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Cambia el rol de un usuario, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @param role el nuevo rol
   * @returns el usuario con el nuevo rol
   */
  async assignRole(id: number, role: Role): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Se encarga de obtener todos los usuarios
   * @returns todos los usuarios, un array de usuarios
   */
  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  /**
   * Se encarga de obtener un usuario por su id
   * @param id del usuario
   * @returns el usuario con ese id o un error
   */
  async findOne(id: number): Promise<Usuario> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  /**
   * Actualiza un usuario por su id
   * @param id del usuario
   * @param updateUserDto los datos para actualizar
   * @returns el usuario actualizado o un error
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Se encarga de eliminar un usuario por su id
   * @param id del usuario
   * @returns el mensaje de que se ha eliminado el usuario o un error
   */
  async remove(id: number) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
