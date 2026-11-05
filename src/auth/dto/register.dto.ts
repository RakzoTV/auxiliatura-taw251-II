import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(16)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
}