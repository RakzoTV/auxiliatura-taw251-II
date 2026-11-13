import { Module } from '@nestjs/common';
import { HabitacionService } from './habitacion.service.js';
import { HabitacionController } from './habitacion.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitacion } from './entities/habitacion.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Habitacion])],
  controllers: [HabitacionController],
  providers: [HabitacionService],
})
export class HabitacionModule {}
