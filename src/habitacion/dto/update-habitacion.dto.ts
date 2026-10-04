import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitacionDto } from './create-habitacion.dto.js';

export class UpdateHabitacionDto extends PartialType(CreateHabitacionDto) {}
