import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';
import { Habitaciones } from './entities/habitacion.data.js';

@Injectable()
export class HabitacionService {
  create(createHabitacionDto: CreateHabitacionDto) {
    const nuevaHabitacion = {
      ...createHabitacionDto,
      idHabitacion: createHabitacionDto.idHabitacion
    }
    Habitaciones.push(nuevaHabitacion)
    return nuevaHabitacion;
  }

  findAll() {
    return Habitaciones;
  }

  findOne(id: number) {
    const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    return habitacion;
  }

  update(id: number, updateHabitacionDto: UpdateHabitacionDto) {
    const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    Object.assign(habitacion, updateHabitacionDto);
    return habitacion;
  }

  remove(id: number) {
    const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    const index = Habitaciones.indexOf(habitacion);
    if (index !== -1) {
      Habitaciones.splice(index, 1);
    }
  }
}
