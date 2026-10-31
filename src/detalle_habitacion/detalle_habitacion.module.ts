import { Module } from '@nestjs/common';
import { DetalleHabitacionService } from './detalle_habitacion.service.js';
import { DetalleHabitacionController } from './detalle_habitacion.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleHabitacion } from './entities/detalle_habitacion.entity.js';
import { Habitacion } from '../habitacion/entities/habitacion.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleHabitacion, Habitacion])],
  controllers: [DetalleHabitacionController],
  providers: [DetalleHabitacionService],
})
export class DetalleHabitacionModule {}
