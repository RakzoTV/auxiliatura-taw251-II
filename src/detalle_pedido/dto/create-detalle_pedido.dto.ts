import { IsNumber } from "class-validator";

export class CreateDetallePedidoDto {

    @IsNumber()
    idPedido: number;

    @IsNumber()
    idProducto: number

    @IsNumber()
    cantidad: number;

    @IsNumber()
    precio_unitario: number;
}
