import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateHabitacionDto {
    @IsNotEmpty()
    @IsNumber()
    idHabitacion: number

    @IsNotEmpty()
    @IsString()
    nombre: string;
    tipo: "individual" | "doble" | "suite";
    precioPorNoche: number;
    capacidad: number;
    descripcion: string;
}
