import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DetallePedido } from "../../detalle_pedido/entities/detalle_pedido.entity.js";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    idPedido: number;

    @Column()
    idReserva: number;

    @Column()
    estado: string; // activo/pendiente/cancelado/entregado

    @Column()
    fecha_creacion: Date;

    @OneToMany(() => DetallePedido, (detallePedido) => detallePedido.pedido)
    detalle_pedidos: Relation<DetallePedido[]>
}
