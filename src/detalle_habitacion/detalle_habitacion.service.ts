import { Injectable } from '@nestjs/common';
import { CreateDetalleHabitacionDto } from './dto/create-detalle_habitacion.dto.js';
import { UpdateDetalleHabitacionDto } from './dto/update-detalle_habitacion.dto.js';

@Injectable()
export class DetalleHabitacionService {
  create(createDetalleHabitacionDto: CreateDetalleHabitacionDto) {
    return 'This action adds a new detalleHabitacion';
  }

  findAll() {
    return `This action returns all detalleHabitacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleHabitacion`;
  }

  update(id: number, updateDetalleHabitacionDto: UpdateDetalleHabitacionDto) {
    return `This action updates a #${id} detalleHabitacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleHabitacion`;
  }
}
