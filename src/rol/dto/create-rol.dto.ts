import { IsIn } from "class-validator";
import { TipoRol } from "../entities/rol.entity.js";

export class CreateRolDto {

    @IsIn([TipoRol.ADMIN, TipoRol.USUARIO], { message: "el rol debe ser ADMIN o USUARIO"})
    nombreRol: TipoRol
}
