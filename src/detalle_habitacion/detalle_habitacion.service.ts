import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleHabitacionDto } from './dto/create-detalle_habitacion.dto.js';
import { UpdateDetalleHabitacionDto } from './dto/update-detalle_habitacion.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleHabitacion } from './entities/detalle_habitacion.entity.js';
import { Repository } from 'typeorm';
import { Habitacion } from '../habitacion/entities/habitacion.entity.js';

@Injectable()
export class DetalleHabitacionService {

  constructor(
    @InjectRepository(DetalleHabitacion)
    private readonly detalleHabitacionRepository: Repository<DetalleHabitacion>,

    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>
  ){}

  async create(createDetalleHabitacionDto: CreateDetalleHabitacionDto) {
    const habitacion = await this.habitacionRepository.findOneBy({idHabitacion: createDetalleHabitacionDto.idHabitacion});
    if(!habitacion){
      throw new NotFoundException("La habitacion con ese ud no existe")
    }

    const detalleHabitacion = this.detalleHabitacionRepository.create({
      ...createDetalleHabitacionDto,
      idHabitacion: habitacion.idHabitacion
    })

    return await this.detalleHabitacionRepository.save(detalleHabitacion)
  }

  async findAll() {
    return await this.detalleHabitacionRepository.find();
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
