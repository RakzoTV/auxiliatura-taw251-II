import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUsuarioRolDto {
    @IsNumber()
    @IsNotEmpty()
    idUsuario: number;
    
    @IsNumber()
    @IsNotEmpty()
    idRol: number;
}
