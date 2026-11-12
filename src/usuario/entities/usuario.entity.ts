import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { UsuarioRol } from "../../usuario_rol/entities/usuario_rol.entity.js";

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

    @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
    roles: Relation<UsuarioRol[]>
}
