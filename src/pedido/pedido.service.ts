import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { UpdatePedidoDto } from './dto/update-pedido.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class PedidoService {

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>
  ){}

  async create(createPedidoDto: CreatePedidoDto) {
    const pedido = this.pedidoRepository.create(createPedidoDto);
    return await this.pedidoRepository.save(pedido)
  }

  async findAll() {
    return await this.pedidoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
