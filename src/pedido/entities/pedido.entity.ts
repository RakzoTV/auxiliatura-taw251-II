import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DetallePedido } from "../../detalle_pedido/entities/detalle_pedido.entity.js";

@Entity()
export class Pedido {

    @PrimaryGeneratedColumn()
    idPedido: number;

    @Column()
    idReserva: number

    @Column()
    fechaPedido: Date;

    @Column()
    estado: string; //entregado, en proceso, cancelado

    @OneToMany(() => DetallePedido, (detallePedido) => detallePedido.pedido)
    detallePedidos: Relation<DetallePedido[]>

}
