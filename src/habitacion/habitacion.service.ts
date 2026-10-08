import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';
import { Habitaciones } from './entities/habitacion.data.js';
import { DB_POOL } from '../database/database.module.js';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class HabitacionService {

  constructor(
    @Inject(DB_POOL) private readonly dbPool: Pool
  ){}

  async create(createHabitacionDto: CreateHabitacionDto) {
    /*const nuevaHabitacion = {
      ...createHabitacionDto,
      idHabitacion: createHabitacionDto.idHabitacion
    }
    Habitaciones.push(nuevaHabitacion)
    return nuevaHabitacion;*/

    const [resultado] = await this.dbPool.query<ResultSetHeader>(
      "INSERT INTO habitaciones(nombre, tipo, precioPorNoche, capacidad, descripcion)" + 
      " VALUES (?,?,?,?,?)", 
      [createHabitacionDto.nombre,
      createHabitacionDto.tipo,
      createHabitacionDto.precioPorNoche,
      createHabitacionDto.capacidad,
      createHabitacionDto.descripcion
      ]
    )

    const resultadoId = resultado.insertId;
    return {
      resultadoId: resultadoId,
      ...createHabitacionDto
    }
  }

  async findAll() {
    //return Habitaciones;

    const [filas] = await this.dbPool.query<RowDataPacket[]>
    ("SELECT * FROM habitaciones");

    return filas;
  }

  async findOne(id: number) {
    /*const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    return habitacion;*/

    const [habitacion] = await this.dbPool.query<RowDataPacket[]>
    ("SELECT * FROM habitaciones WHERE idHabitacion = ?", [id])

    if (habitacion.length === 0){
      throw new NotFoundException("habitacion no encontrada")
    }

    return habitacion[0]
  }

  async update(id: number, updateHabitacionDto: UpdateHabitacionDto) {
    /*const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    Object.assign(habitacion, updateHabitacionDto);
    return habitacion;*/

    const habitacion = await this.findOne(id);
    if(!habitacion){
      throw new NotFoundException("habitacion no encontrada")
    }

    const nuevaHabitacion = {...habitacion, ...updateHabitacionDto}
    await this.dbPool.query(
      "UPDATE habitaciones SET nombre = ?, tipo = ?, precioPorNoche = ?, capacidad = ?, descripcion = ?" +
      " WHERE idHabitacion = ?",
      [nuevaHabitacion.nombre, 
        nuevaHabitacion.tipo, 
        nuevaHabitacion.precioPorNoche, 
        nuevaHabitacion.capacidad, 
        nuevaHabitacion.descripcion, 
        id]
    )

    return {
      mensaje: "habitacion actualizada",
      nuevaHabitacion: nuevaHabitacion
    }
    
  }

  async remove(id: number) {
    /*const habitacion = Habitaciones.find((h) => h.idHabitacion === id);
    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }
    const index = Habitaciones.indexOf(habitacion);
    if (index !== -1) {
      Habitaciones.splice(index, 1);
    }*/

    const habitacion = await this.findOne(id);

    if(!habitacion){
      throw new NotFoundException("habitacion no encontrada")
    }

    const [resultado] = await this.dbPool.query<ResultSetHeader>
    ("DELETE FROM habitaciones WHERE idHabitacion = ?", [id]);  

    return {
      mensaje: "habitacion eliminada",
      filas_afectadas: resultado.affectedRows
    } 
  }
}
