import { Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle_pedido.service.js';
import { DetallePedidoController } from './detalle_pedido.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle_pedido.entity.js';
import { Pedido } from '../pedido/entities/pedido.entity.js';
import { Producto } from '../producto/entities/producto.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([DetallePedido, Pedido, Producto])],
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
})
export class DetallePedidoModule {}
