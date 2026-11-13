import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoService {

  constructor(
     @InjectRepository(Producto)
     private readonly productoRepository: Repository<Producto>
  ){}


  async create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(producto);
  }

  async findAll() {
    return await this.productoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
