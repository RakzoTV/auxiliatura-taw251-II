import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateDetalleHabitacionDto {
    @IsNumber({maxDecimalPlaces: 0})
    idHabitacion: number;

    @IsString()
    tipo_cama: string;

    @IsNumber()
    cantidad_camas: number;

    @IsString()
    vista: string;

    @IsBoolean()
    tiene_wifi: boolean;
}
