import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Habitacion {

    @PrimaryGeneratedColumn()
    idHabitacion: number

    @Column({length: 32})
    nombre: string;

    @Column()
    tipo: "individual" | "doble" | "suite";

    @Column({type: "decimal", precision: 10, scale: 2})  //10.25
    precioPorNoche: number;

    @Column({type: "int"})
    capacidad: number;

    @Column({length: 255})
    descripcion: string;

}
