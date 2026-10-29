import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Habitacion } from "../../habitacion/entities/habitacion.entity.js";


@Entity()
export class Reserva {

    @PrimaryGeneratedColumn()
    idReserva: number

    @Column()
    idHabitacion: number
    
    @Column()
    nombreHuesped: string;
    
    @Column()
    fechaCheckIn: Date;
    
    @Column()
    fechaCheckOut: Date;
    
    @Column()
    cantidadHuespedes: number;
    
    @Column()
    precioTotal: number;

    @ManyToOne(() => Habitacion, (habitacion) => habitacion.reservas)
    @JoinColumn({ name: "idHabitacion", referencedColumnName: "idHabitacion" })
    habitacion: Relation<Habitacion>
}
