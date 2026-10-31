import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity.js';
import { Repository } from 'typeorm';
import { Habitacion } from '../habitacion/entities/habitacion.entity.js';


@Injectable()
export class ReservaService {

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRespository: Repository<Reserva>,

    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion> 
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const habitacion = await this.habitacionRepository.findOneBy({idHabitacion: createReservaDto.idHabitacion});
    if(!habitacion){
      throw new NotFoundException("la habitacion no existe")
    }

    const reserva = this.reservaRespository.create({
      ...createReservaDto,
      idHabitacion: habitacion.idHabitacion,
    })

    return await this.reservaRespository.save(reserva)
  }

  async findAll() {
    return await this.reservaRespository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
 }