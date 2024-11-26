//Archivo de controlador de usuario

//Define las rutas y metodos HTTP para interactuar con los usuarios.Tambien gestiona la autorizacion y proteccion de las rutas mediante guards

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { UserService } from './user.service';   //maneja la logica de la gestion de usuarios
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';   //Asegura que el usuario tenga los roles correctos
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';   //Asegura que el usuario este autenticado
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Usuarios')
@Controller('user')   
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo usuario, solo con el rol USER
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error 
   */
  @Post('register')   //Ruta POST /user/register
  @ApiOperation({ summary: 'Crea un nuevo usuario con el rol USER solamente' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el usuario' })
  async create(@Body() dto: CreateUserDto){
    //Se llama la servicio para crear el usuario
    return await this.userService.register(dto);
  }

  /**
   * Se loguea un usuario
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario logueado
   */  
  @Post('login')   //Ruta POST /user/login
  async login(@Body() dto: CreateUserDto) {
    //Se llama la servicio para loguear el usuario
    return await this.userService.login(dto);
  }

  /**
   * Se encarga de buscar todos los usuarios, solo los SUPER pueden hacerlo
   * @returns todos los usuarios
   */
  @Get()   //Ruta GET /user
  @ApiOperation({ summary: 'Busca todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados correctamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar los usuarios' })
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles('SUPER')
  async findAll() {
    //Se llama la servicio para obtener todos los usuarios
    return await this.userService.findAll();
  }

  /**
   * Busca un usuario por su ID, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @returns el usuario con ese ID o un error
   */
  @Get(':id')  //Ruta GET /user/:id
  @ApiOperation({ summary: 'Busca un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar el usuario' })
  @Roles('SUPER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: number) {
    //Se llama la servicio para obtener el usuario
    return await this.userService.findOne(id);
  }

  /**
   * Actualiza el rol de un usuario, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @param updateRoleDto del tipo UpdateRoleDto
   * @returns el usuario con el nuevo rol
   */
  @Patch(':id/role')   //Ruta PATCH /user/:id/role
  @ApiOperation({ summary: 'Actualiza el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el rol del usuario' })  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER')
  async assignRole(
    @Param('id', ParseIntPipe ) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    //Se llama la servicio para cambiar el rol del usuario
    return await this.userService.assignRole(id, updateRoleDto.role);
  }

  /**
   * Elimina un usuario por su ID, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @returns el mensaje de que se ha eliminado el usuario o un error
   */
  @Delete(':id')   //Ruta DELETE /user/:id
  @ApiOperation({ summary: 'Elimina un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER')
  async remove(@Param('id') id: number) {
    //Se llama la servicio para eliminar el usuario
    return await this.userService.remove(id);
  }
}
