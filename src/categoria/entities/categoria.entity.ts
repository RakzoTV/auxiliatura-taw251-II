import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Producto } from "../../producto/entities/producto.entity.js";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column()
    nombre: string;

    @ManyToMany(() => Producto, (producto) => producto.categorias)
    productos: Relation<Producto[]>
}
