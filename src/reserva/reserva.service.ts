import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';


@Injectable()
export class ReservaService {
  /*create(createReservaDto: CreateReservaDto) {

    /*const habitacion = Habitaciones.find((h) => h.idHabitacion === createReservaDto.habitacionId)

    if(!habitacion){
      throw new NotFoundException("Habitacion no encontrada")
    }

    if(createReservaDto.fechaCheckOut <= createReservaDto.fechaCheckIn){
      throw new PreconditionFailedException("La fecha de check-out debe ser posterior a la fecha de check-in")
    }

    if(createReservaDto.cantidadHuespedes > habitacion.capacidad){
      throw new PreconditionFailedException(`La cantidad de huéspedes excede la capacidad de la habitación: ${habitacion.capacidad}`)
    }
    

    const noches = createReservaDto.fechaCheckIn && createReservaDto.fechaCheckOut
      ? Math.ceil((createReservaDto.fechaCheckOut.getTime() - createReservaDto.fechaCheckIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const precioTotal = noches * habitacion.precioPorNoche;

    const nuevaReserva = {
      ...createReservaDto,
      precioTotal: precioTotal,
      idReserva: createReservaDto.idReserva
    }
    reservaData.push(nuevaReserva)
    return  {
      ...nuevaReserva,
      precioTotal: precioTotal,
      noches: noches
    };
  }

  findAll() {
    return reservaData;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }*/
 }