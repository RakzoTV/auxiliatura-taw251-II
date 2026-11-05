import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ unique: true})
    email: string;

    @Column({ length: 16 })
    username: string;

    @Column()
    password: string;
}
