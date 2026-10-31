import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Producto } from "../../producto/entities/producto.entity.js";
import { Pedido } from "../../pedido/entities/pedido.entity.js";

@Entity()
export class DetallePedido {
    @PrimaryGeneratedColumn()
    idDetallePedido: number;

    @Column()
    idPedido: number;

    @Column()
    idProducto: number;

    @Column()
    cantidad: number;

    @Column()
    precio_unitario: number;

    @ManyToOne(() => Producto, (producto) => producto.detallePedidos)
    @JoinColumn({name: "idProducto", referencedColumnName: "idProducto"})
    producto: Relation<Producto>

    @ManyToOne(() => Pedido, (pedido) => pedido.detallePedidos)
    @JoinColumn({name: "idPedido", referencedColumnName: "idPedido"})
    pedido: Relation<Pedido>
}
