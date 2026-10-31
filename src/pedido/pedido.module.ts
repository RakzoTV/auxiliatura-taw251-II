import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service.js';
import { PedidoController } from './pedido.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
