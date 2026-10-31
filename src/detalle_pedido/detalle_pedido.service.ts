import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto.js';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle_pedido.entity.js';
import { Repository } from 'typeorm';
import { Pedido } from '../pedido/entities/pedido.entity.js';
import { Producto } from '../producto/entities/producto.entity.js';
import { privateDecrypt } from 'crypto';

@Injectable()
export class DetallePedidoService {

  constructor(
    @InjectRepository(DetallePedido)
    private readonly detallePedidoReporsitory: Repository<DetallePedido>,

    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>

  ){}

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const pedido = await this.pedidoRepository.findOneBy({idPedido: createDetallePedidoDto.idPedido});
    if(!pedido){
      throw new NotFoundException("El pedido no existe");
    }

    const producto = await this.productoRepository.findOneBy({idProducto: createDetallePedidoDto.idProducto})
    if(!producto){
      throw new NotFoundException("El producto no existe")
    }

    const detallePedido = this.detallePedidoReporsitory.create({
      ...createDetallePedidoDto,
      idPedido: pedido.idPedido,
      idProducto: producto.idProducto
    })

    return await this.detallePedidoReporsitory.save(detallePedido)
  }

  async findAll() {
    return await this.detallePedidoReporsitory.find({relations: {pedido: true, producto: true}});
  }

  findOne(id: number) {
    return `This action returns a #${id} detallePedido`;
  }

  update(id: number, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return `This action updates a #${id} detallePedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallePedido`;
  }
}
