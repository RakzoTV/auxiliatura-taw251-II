import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Habitacion } from "../../habitacion/entities/habitacion.entity.js";

@Entity()
export class DetalleHabitacion {

    @PrimaryGeneratedColumn()
    idDetalleHabitacion: number;

    @Column()
    idHabitacion: number;

    @Column({type: "enum", enum: ["simple", "doble", "kingsize"]})
    tipoCama: "simple" | "doble" | "kingsize";

    @Column({type: "int"})
    cantidadCamas: number;

    @Column({length: 50})
    vista: string;

    @Column({type: "boolean"})
    tieneWifi: boolean;

    @OneToOne(() => Habitacion, (habitacion) => habitacion.detalleHabitacion)
    @JoinColumn({name: "idHabitacion", referencedColumnName: "idHabitacion"})
    habitacion: Relation<Habitacion>;
    
    
}
