import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';

import { DB_POOL } from '../database/database.module.js';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { InjectRepository } from '@nestjs/typeorm';
import { Habitacion } from './entities/habitacion.entity.js';
import { Repository } from 'typeorm';
import { extname, join } from 'path';
import { rename } from 'fs/promises';
import { UPLOADS_DIR } from '../common/multer.config.js';

@Injectable()
export class HabitacionService {

  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>
  ) { }

  private async renameImagen(habitacion: Habitacion, archivo: Express.Multer.File) {
    const ext = extname(archivo.filename);
    const slug = habitacion.nombre
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]/g, "_");
    const nombre = `habitacion_${habitacion.idHabitacion}_${slug}_${Date.now()}${ext}`;

    await rename(join(UPLOADS_DIR, archivo.filename), join(UPLOADS_DIR, nombre));
    return nombre;
  }


  async create(createHabitacionDto: CreateHabitacionDto, imagen?: Express.Multer.File) {
    let habitacion = this.habitacionRepository.create(createHabitacionDto);
    habitacion = await this.habitacionRepository.save(habitacion);

    if(imagen){
      habitacion.imagen = await this.renameImagen(habitacion, imagen);
      habitacion = await this.habitacionRepository.save(habitacion);
    }

    return habitacion;

  }

  async findAll() {
    //por detras el find hace: SELECT * FROM habitaciones
    return await this.habitacionRepository.find({ relations: { detalleHabitacion: true, reservas: true } });
    //relations por atras hace n join con detelle habitacion para traer los datos de la habitacion y su detalle habitacion
  }

  async findOne(id: number) {

    //findOneBy por detras hace SELECT * FROM habitaciones WHERE idHabitacion = ?
    const habitacion = await this.habitacionRepository.findOneBy({ idHabitacion: id })
    if (!habitacion) {
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
