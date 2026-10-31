import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreatePedidoDto {

    @IsNumber()
    idReserva: number;

    @IsDate()
    @Type(() => Date)
    fechaPedido: Date;

    @IsString()
    estado: string; //entregado, en proceso, cancelado
}
