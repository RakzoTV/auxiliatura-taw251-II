import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, type Relation } from "typeorm";
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

    @Column()
    descripcion: string;

    @ManyToMany(() => Categoria, (categoria) => categoria.productos)
    @JoinTable({
        name: "producto_categoria", //Tabla intermedia
        joinColumn: { name: "idProducto", referencedColumnName: "idProducto"},  //Tabla A
        inverseJoinColumn: { name: "idCategoria", referencedColumnName: "idCategoria"} //Tabla B
    })
    categorias: Relation<Categoria[]> 

    @OneToMany(() => DetallePedido, (detallePedido) => detallePedido.producto)
    detallePedidos: Relation<DetallePedido[]>
}
