import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity.js";
import { DetallePedido } from "../../detalle_pedido/entities/detalle_pedido.entity.js";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    idProducto: number;

    @Column()
    nombre: string;

    @Column()
    precio: number;

    @ManyToMany(() => Categoria, (categoria) => categoria.productos)
    @JoinTable({name: "producto_categoria",
        joinColumn: {
            name: "idProducto",
            referencedColumnName: "idProducto"
        },
        inverseJoinColumn: {
            name: "idCategoria",
            referencedColumnName: "idCategoria"
        }
    })
    categorias: Relation<Categoria[]>

    @OneToMany(() => DetallePedido, (detellePedido) => detellePedido.producto)
    detalle_pedidos: Relation<DetallePedido[]>
}
