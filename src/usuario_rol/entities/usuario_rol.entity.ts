import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation, UpdateDateColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity.js";
import { Rol } from "../../rol/entities/rol.entity.js";

@Entity()
export class UsuarioRol {
    
    @PrimaryGeneratedColumn()
    idUsuarioRol: number;

    @Column()
    idUsuario: number;

    @Column()
    idRol: number;

    @CreateDateColumn()
    asignadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
    
    @DeleteDateColumn()
    revocadoEn: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.roles)
    @JoinColumn({name: "idUsuario", referencedColumnName: "idUsuario"})
    usuario: Relation<Usuario>;

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    @JoinColumn({name: "idRol", referencedColumnName: "idRol"})
    rol: Relation<Rol>;

}
