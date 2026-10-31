import { Type } from "class-transformer";
import { IsDate, isDate, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class CreateReservaDto {

    @IsNumber()
    idHabitacion: number

    @IsString()
    nombreHuesped: string;

    @Type(() => Date)
    @IsDate()
    fechaCheckIn: Date;

    @Type(() => Date)
    @IsDate()
    fechaCheckOut: Date;

    @IsNumber()
    cantidadHuespedes: number;

    @IsNumber()
    precioTotal: number;
}
