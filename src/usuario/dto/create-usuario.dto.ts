import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    /* INFORMACION DEL USUARIO QUE HAY QUE MANDAR */
    @IsString()
    @MaxLength(16)
    @MinLength(3)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(6)
    password: string;
}
