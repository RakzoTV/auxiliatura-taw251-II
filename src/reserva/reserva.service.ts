import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity.js';
import { Repository } from 'typeorm';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { Habitacion } from '../habitacion/entities/habitacion.entity.js';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,

        @InjectRepository(Habitacion)
        private readonly habitacionRepository: Repository<Habitacion>
    ){}

    async create(createReservaDto: CreateReservaDto) {
        const habitacion = await this.habitacionRepository
        .findOneBy({ idHabitacion: createReservaDto.idHabitacion})

        if(!habitacion){
            throw new NotFoundException("La habitacion no existe")
        }

        const reserva = await this.reservaRepository.create({
            ...createReservaDto,
            idHabitacion: habitacion.idHabitacion
        })

        return await this.reservaRepository.save(reserva)
    }

    async findAll() {
        //find por detras hace SELECT * FROM reservas
        return this.reservaRepository.find();
    }

    async findOne(id: number) {
        return `This action returns a #${id} reserva`;
    }

    async update(id: number, updateReservaDto: UpdateReservaDto) {
        return `This action updates a #${id} reserva`;
    }

    async remove(id: number) {
        return `This action removes a #${id} reserva`;
    }
}
