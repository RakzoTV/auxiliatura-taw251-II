import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateHabitacionDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(["individual", "doble", "suite"])
    tipo: "individual" | "doble" | "suite";

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    precioPorNoche: number;

    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 0})
    capacidad: number;

    @IsNotEmpty()
    @IsString()
    descripcion: string;
}
