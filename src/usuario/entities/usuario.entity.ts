import { Entity } from "typeorm";

@Entity()
export class Usuario {
    idUsuario: number;
    username: string;
    password: string;
}
