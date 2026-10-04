import { Module } from '@nestjs/common';
import { HabitacionService } from './habitacion.service.js';
import { HabitacionController } from './habitacion.controller.js';

@Module({
  controllers: [HabitacionController],
  providers: [HabitacionService],
})
export class HabitacionModule {}
