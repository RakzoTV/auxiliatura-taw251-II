import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Habitacion } from "../../habitacion/entities/habitacion.entity.js";

@Entity()
export class DetalleHabitacion {

    @PrimaryGeneratedColumn()
    idDetalleHabitacion: number;

    @Column()
    idHabitacion: number;

    @Column({type: "varchar", length: 20})
    tipo_cama: string;

    @Column({type: "int"})
    cantidad_camas: number;

    @Column()
    vista: string;

    @Column()
    tiene_wifi: boolean;

    @OneToOne(() => Habitacion, (habitacion) => habitacion.detalleHabitacion)
    @JoinColumn({ name: "idHabitacion", referencedColumnName: "idHabitacion"})
    habitacion: Relation<Habitacion>
}
