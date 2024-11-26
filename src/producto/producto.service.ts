//Archivo de servicios de producto

//Define el servicio de productos, que contien la logica para interacturar con la DB utilizando Prisma. Es llamado desde el controlador para realizar operaciones sobre los productos

import { Injectable, NotFoundException } from '@nestjs/common';   //Importa las herramientas de NestJS
import { CreateProductoDto } from './dto/create-producto.dto';   //se importa para gestionar los datos de entrada
import { UpdateProductoDto } from './dto/update-producto.dto';   ////se importa para gestionar los datos de entrada
import { prisma } from 'src/config/database';   //se importa el cliete de prisma para interactuar con la DB

@Injectable()
export class ProductoService {

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
      return await prisma.producto.create( { data: { nombre, descripcion, imagen } } );
    } 
    catch (error) {
      //Si falla, devolvemos un error
      throw new Error('Error al crear el producto');
    }
  }

  /**
   * Devuelve todos los productos
   * @returns todos los productos
   */
  async findAll() {
    //Llamamos a la base de datos para obtener todos los productos
    return await prisma.producto.findMany();
  }

  /**
   * Devuelve un producto por su id
   * @param id del producto
   * @returns el producto si se encuentra
   */
  async findOne(id: number) {
    //Llamamos a la base de datos para obtener el producto
    const producto = await prisma.producto.findUnique({ where: { id } });

    //Si no se encuentra, devolvemos un error
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    //Devolvemos el producto
    return producto;
  }

  /**
   * Se actualiza un producto
   * @param id del producto
   * @param dto que es del tipo UpdateProductoDto
   * @returns el producto actualizado o un error
   */
  async update(id: number, dto: UpdateProductoDto) {
    try {
      //Llamamos al metodo findOne (que esta arriba) para obtener el producto por su id
      await this.findOne(id);
    } 
    catch (error) {
      //Si no se encuentra, devolvemos un error
      throw new NotFoundException('Producto no encontrado');
    }
    
    //Llamamos a la base de datos para actualizar el producto
    return prisma.producto.update({ where: { id }, data: dto });
  }

  /**
   * Se elimina un producto
   * @param id del producto
   * @returns un error sino se encuentra
   */
  async remove(id: number) {
    try {
      //Llamamos a la base de datos para eliminar el producto
      return await prisma.producto.delete({ where: { id } });
    } 
    catch (error) {
      //Si no se encuentra, devolvemos un error
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}