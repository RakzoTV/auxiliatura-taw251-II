import { Type } from "class-transformer";
import { IsDate, isDate, IsOptional } from "class-validator";

export class CreateReservaDto {


    @IsOptional()
    idHabitacion: number

    @IsOptional()
    nombreHuesped: string;
    @IsOptional()
    idHuesped: number;

    @Type(() => Date)
    @IsOptional()
    fechaCheckIn: Date;

    @Type(() => Date)
    @IsOptional()
    fechaCheckOut: Date;

    @IsOptional()
    cantidadHuespedes: number;

    @IsOptional()
    precioTotal: number;
}
