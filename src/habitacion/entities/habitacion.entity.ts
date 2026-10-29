import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DetalleHabitacion } from "../../detalle_habitacion/entities/detalle_habitacion.entity.js";
import { Reserva } from "../../reserva/entities/reserva.entity.js";

@Entity()
export class Habitacion {

    @PrimaryGeneratedColumn()
    idHabitacion: number

    @Column({length: 32})
    nombre: string;

    @Column({type: "enum", enum: ["individual", "doble", "suite"]})
    tipo: "individual" | "doble" | "suite";

    @Column({type: "decimal", precision: 10, scale: 2})  //10.25
    precioPorNoche: number;

    @Column({type: "int"})
    capacidad: number;

    @Column({length: 255})
    descripcion: string;

    @OneToOne(() => DetalleHabitacion, (detalleHabitacion) => detalleHabitacion.habitacion)
    detalleHabitacion: Relation<DetalleHabitacion>;

    @OneToMany(() => Reserva, (reserva) => reserva.habitacion)
    reservas: Relation<Reserva[]>
}
