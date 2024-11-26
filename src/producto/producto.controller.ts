//Archivo de controlador de producto, define las rutas y controladores para interactuar con los productos

//Maneja las rutas HTTP relacionadas con los productos

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';   //Decoradores y clases para definir y gestionar las rutas, validacion y autenticacion
import { ProductoService } from './producto.service';   //Servicio que contiene la logica para trabajar con los productos
import { CreateProductoDto } from './dto/create-producto.dto';  //Para gestionar los datos de entrada
import { UpdateProductoDto } from './dto/update-producto.dto';   //Para gestionar los datos de entrada
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';   //Guard de autenticacion
import { RolesGuard } from 'src/auth/guards/roles.guard';   //Guard de roles
import { Roles } from 'src/auth/decorators/roles.decorator';   //Decorador para roles
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';   //Para la gestion de archivos subidos
import { diskStorage } from 'multer';
import { extname } from 'path';


@ApiTags('Productos')   //Decorador que proporciona un grupo para las operaciones de productos en la documentacion de Swagger
@ApiBearerAuth('JWT')   //Indica que la autenticacion JWT es requerida
@UseGuards(JwtAuthGuard, RolesGuard)   //Se utiliza para proteger todas las rutas con autenticacion JWT y control de roles
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  /**
   * Crea un producto, solo los ADMIN y SUPER pueden crear
   * @param dto que es del tipo CreateProductoDto
   * @returns el producto creado
   */
  @Post()   //Ruta POST /producto
  @ApiOperation({ summary: 'Crea un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const unixSuffix = Date.now()+'-'+Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${unixSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Roles('ADMIN', 'SUPER')   //Solo los ADMIN y SUPER pueden crear
  async create(
    @UploadedFile() file: Express.Multer.File,   //Extrae el archivo subido y lo guarda en la carpeta uploads
    @Body() dto: CreateProductoDto) {
      const imagePath = `uploads/${file.filename}`;
    //Se llama al servicio para crear el producto
    return await this.productoService.create({ ...dto, imagen: imagePath });
  }

  /**
   * Obtiene todos los productos, sin importar el rol
   * @returns todos los productos
   */
  @Get()   //Ruta GET /producto
  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles('ADMIN', 'SUPER', 'USER')   //Accesible para todos los roles
  async findAll() {
    //Se llama al servicio para obtener todos los productos
    return await this.productoService.findAll();
  }

  /**
   * Encuentra un producto por id, sin importar el rol
   * @param id el id del producto
   * @returns 
   */
  @Get(':id')   //Ruta GET /producto/:id
  @ApiOperation({ summary: 'Obtiene un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto obtenido' })
  @ApiResponse({ status: 403, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER', 'USER')   //Accesible para todos los roles
  async findOne(@Param('id', ParseIntPipe) id: number) {
    //Se llama al servicio para obtener el producto
    return await this.productoService.findOne(id);
  }

  /**
   * Actualiza un producto por id
   * @param id que es el id del producto
   * @param dto que es del tipo UpdateProductoDto
   * @returns el producto actualizado, siempre y cuando exista
   */
  @Patch(':id')   //Ruta PATCH /producto/:id
  @ApiOperation({ summary: 'Actualiza un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('SUPER')   //Solo los SUPER pueden actualizar
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    //Se llama al servicio para actualizar el producto
    return await this.productoService.update(id, dto);
  }

  /**
   * Elimina un producto por id, solo los ADMIN y SUPER pueden eliminar
   * @param id que es el id del producto
   * @returns el msj de producto eliminado o producto no encontrado
   */
  @Delete(':id')   //Ruta DELETE /producto/:id
  @ApiOperation({ summary: 'Elimina un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER')   //Solo los ADMIN y SUPER pueden eliminar
  async remove(@Param('id', ParseIntPipe) id: number) {
    //Se llama al servicio para eliminar el producto
    return await this.productoService.remove(id);
  }

}