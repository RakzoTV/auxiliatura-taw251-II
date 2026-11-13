import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { UsuarioRol } from "../../usuario_rol/entities/usuario_rol.entity.js";

export enum TipoRol {
    ADMIN = "ADMIN",
    USUARIO = "USUARIO"
}

@Entity()
export class Rol {

    @PrimaryGeneratedColumn()
    idRol: number;

    @Column({type: "enum", enum: TipoRol})
    nombreRol: TipoRol;

    @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
    usuarios: Relation<UsuarioRol[]>
}
