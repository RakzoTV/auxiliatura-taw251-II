import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateHabitacionDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 32)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(["individual", "doble", "suite"])
    tipo: "individual" | "doble" | "suite";

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    precioPorNoche: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 0})
    capacidad: number;

    @IsNotEmpty()
    @IsString()
    @Length(3, 255)
    descripcion: string;
}
