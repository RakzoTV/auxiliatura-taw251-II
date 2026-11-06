import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({length: 16})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({length: 255, nullable: false})
    password: string;
}
