import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleHabitacionDto } from './create-detalle_habitacion.dto.js';

export class UpdateDetalleHabitacionDto extends PartialType(CreateDetalleHabitacionDto) {}
