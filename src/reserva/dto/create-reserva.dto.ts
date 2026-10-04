import { Type } from "class-transformer";
import { IsDate, isDate } from "class-validator";

export class CreateReservaDto {
    idReserva: number
    habitacionId: number
    nombreHuesped: string;

    @Type(() => Date)
    fechaCheckIn: Date;

    @Type(() => Date)
    fechaCheckOut: Date;
    cantidadHuespedes: number;
}
