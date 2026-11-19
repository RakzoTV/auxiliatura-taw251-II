import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service.js';
import { ReporteController } from './reporte.controller.js';
import { HabitacionModule } from '../habitacion/habitacion.module.js';

@Module({
  imports: [HabitacionModule],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
