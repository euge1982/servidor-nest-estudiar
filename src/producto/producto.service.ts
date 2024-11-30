//Archivo de servicios de producto

//Define el servicio de productos, que contien la logica para interacturar con la DB utilizando Prisma. Es llamado desde el controlador para realizar operaciones sobre los productos

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';   //Importa las herramientas de NestJS
import { CreateProductoDto } from './dto/create-producto.dto';   //se importa para gestionar los datos de entrada
import { UpdateProductoDto } from './dto/update-producto.dto';   ////se importa para gestionar los datos de entrada
import { PrismaService } from 'src/prisma/prisma.service';   //se importa para interactuar con la DB

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) {}


  /**
   * Crea un nuevo producto
   * @param createProductodto que es de esa clase
   * @returns el producto creado o un error
   */
  async create(createProductodto: CreateProductoDto) {
    //Desestructuramos el createProductodto
    const { nombre, descripcion, imagen } = createProductodto;

    try {
      //Llamamos a la base de datos para crear el producto
      return await this.prisma.producto.create( { data: { nombre, descripcion, imagen } } );
    } 
    catch (error) {
      // Si ocurre un error, lo capturamos y lanzamos un error más específico
      throw new InternalServerErrorException('Error al crear el producto: ' + error.message);
    }
  }


  /**
   * Devuelve todos los productos
   * @returns todos los productos
   */
  async findAll() {
     try {
      //Llamamos a la base de datos para obtener todos los productos
      return await this.prisma.producto.findMany();
    } 
    catch (error) {
      // Si hubo un error de base de datos, lo capturamos
      throw new InternalServerErrorException('Error al obtener los productos: ' + error.message);
    }
  }


  /**
   * Devuelve un producto por su id
   * @param id del producto
   * @returns el producto si se encuentra
   */
  async findOne(id: number) {
    try {
      //Se llama a la base de datos para obtener el producto
      const producto = await this.prisma.producto.findUnique({ where: { id } });
      
      // Si no se encuentra, lanzamos una excepción NotFoundException
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      return producto;
    } 
    catch (error) {
      // Si hubo un error de base de datos, lo capturamos
      throw new InternalServerErrorException('Error al obtener el producto: ' + error.message);
    }
  }


  /**
   * Se actualiza un producto
   * @param id del producto
   * @param dto que es del tipo UpdateProductoDto
   * @returns el producto actualizado o un error
   */
  async update(id: number, dto: UpdateProductoDto) {
   try {
      // Buscamos el producto en la base de datos
      const productoExistente = await this.findOne(id);

      // Si no existe el producto, lanzamos una excepción
      if (!productoExistente) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Intentamos actualizar el producto
      return await this.prisma.producto.update({
        where: { id },
        data: dto,
      });
    } 
    catch (error) {
      // Si hay algún error durante la actualización, lo manejamos
      throw new InternalServerErrorException('Error al actualizar el producto: ' + error.message);
    }
  }


  /**
   * Se elimina un producto
   * @param id del producto
   * @returns un error sino se encuentra
   */
  async remove(id: number) {
    try {
      // Buscamos el producto en la base de datos
      const producto = await this.findOne(id);

      // Si no existe el producto, lanzamos una excepción
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Eliminamos el producto
      return await this.prisma.producto.delete({ where: { id } });
    } 
    catch (error) {
      // Si hay un error al eliminar, lo lanzamos
      throw new InternalServerErrorException('Error al eliminar el producto: ' + error.message);
    }
  }
}