//Archivo de controlador de producto, define las rutas y controladores para interactuar con los productos

//Maneja las rutas HTTP relacionadas con los productos

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UploadedFile, UseInterceptors, ForbiddenException, NotFoundException } from '@nestjs/common';   //Decoradores y clases para definir y gestionar las rutas, validacion y autenticacion
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
import { Public } from 'src/auth/decorators';


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
  @ApiOperation({ summary: 'Crea un producto, solo los ADMIN y SUPER pueden hacerlo' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({   //Donde se guarda el archivo
        destination: './uploads',   //Carpeta de destino
        filename: (req, file, callback) => {   //Funcion para generar el nombre unico del archivo
          const unixSuffix = Date.now()+'-'+Math.round(Math.random() * 1E9);  //Genera un id unico (Marca de tiempo y numero aleatorio (paraevitar colisiones))
          const ext = extname(file.originalname);   //Extension del archivo original
          const filename = `${file.fieldname}-${unixSuffix}${ext}`;   //fieldname-unixSuffix.ext
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
      try {
        if (!file) {
          throw new ForbiddenException('No image uploaded');
        }
        const imagePath = `uploads/${file.filename}`;   //Ruta de la imagen
        //Se llama al servicio para crear el producto
        return await this.productoService.create({ ...dto, imagen: imagePath });
      } 
      catch (error) {
        throw new ForbiddenException(error.message || 'Error creating product');
      }
  }


  /**
   * Obtiene todos los productos, sin importar el rol
   * @returns todos los productos
   */
  @Public()   //Ruta publica
  @Get()   //Ruta GET /producto
  @ApiOperation({ summary: 'Obtiene todos los productos sin necesidad de autenticacion' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async findAll() {
    try {
      //Se llama al servicio para obtener todos los productos
      return await this.productoService.findAll();
    } 
    catch (error) {
      //En caso de error
      throw new ForbiddenException('Error fetching products');
    }
  }


  /**
   * Encuentra un producto por id, sin importar el rol
   * @param id el id del producto
   * @returns 
   */
  @Public()   //Ruta publica
  @Get(':id')   //Ruta GET /producto/:id
  @ApiOperation({ summary: 'Obtiene un producto por id, sin necesidad de autenticacion' })
  @ApiResponse({ status: 200, description: 'Producto obtenido' })
  @ApiResponse({ status: 403, description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      //Se llama al servicio para obtener el producto
      const product = await this.productoService.findOne(id);
      //Si no se encuentra
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      //Si se encuentra
      return product;
    } 
    catch (error) {
      //En caso de error
      throw new NotFoundException(error.message || 'Error finding product');
    }
  }


  /**
   * Actualiza un producto por id, solo los SUPER pueden actualizar
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
    try {
      //Se llama al servicio para actualizar el producto
      const updatedProduct = await this.productoService.update(id, dto);
      //Si no se encuentra
      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }
      //Si se encuentra
      return updatedProduct;
    } 
    catch (error) {
      //En caso de error
      throw new NotFoundException(error.message || 'Error updating product');
    }
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
    try {
      //Se llama al servicio para eliminar el producto
      const removedProduct = await this.productoService.remove(id);
      //Si no se encuentra
      if (!removedProduct) {
        throw new NotFoundException('Product not found');
      }
      //Si se encuentra
      return { message: 'Product successfully deleted' };
    } 
    catch (error) {
      //En caso de error
      throw new NotFoundException(error.message || 'Error deleting product');
    }
  }
}