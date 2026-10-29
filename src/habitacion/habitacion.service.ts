import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';

import { DB_POOL } from '../database/database.module.js';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { InjectRepository } from '@nestjs/typeorm';
import { Habitacion } from './entities/habitacion.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class HabitacionService {

  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>
  ){}

  async create(createHabitacionDto: CreateHabitacionDto) {
    //Paso 1 crear el registro con los datos que vengan del dto
      const habitacion = this.habitacionRepository.create(createHabitacionDto);

      //Paso 2 guardar el registro en la bd
      return await this.habitacionRepository.save(habitacion);
      //el save por detras hace INSERT INTO habitaciones(nombre, tipo, precioPorNoche, capacidad, descripcion) VALUES (?,?,?,?,?)
      //con los valores del create/dto y devuelve el registro que se guardo en la bd con el idHabitacion generado por la bd
  }

  async findAll() {
    //por detras el find hace: SELECT * FROM habitaciones
    return await this.habitacionRepository
    .find({relations: {detalleHabitacion: true, reservas: true}, });
  }

  async findOne(id: number) {

    //findOneBy por detras hace SELECT * FROM habitaciones WHERE idHabitacion = ?
    const habitacion = await this.habitacionRepository.findOneBy({idHabitacion: id})
    if(!habitacion){
      throw new NotFoundException("habitacion no encontrada")
    }

    

    return habitacion;
  }

  async update(id: number, updateHabitacionDto: UpdateHabitacionDto) {

    //Paso 1 verificar que la habitacion exista
    await this.findOne(id);

    //Paso 2 actualizar la habitacion
    const habitacionUpdated = await this.habitacionRepository.update(id, updateHabitacionDto)
    //por detras hace UPDATE habitaciones SET nombre = ?, tipo = ?, precioPorNoche = ?, capacidad = ?, descripcion = ? WHERE idHabitacion = ?
    //con los datos que vengan en el dto y el id de la habitacion a actualizar
    return habitacionUpdated;
  }

  async remove(id: number) {

    //Paso 1 verificar que la habitacion exista
    await this.findOne(id);

    //Paso 2 eliminar la habitacion
    return await this.habitacionRepository.delete(id);
    //por detras hace DELETE FROM habitaciones WHERE idHabitacion = ?
  }
}
