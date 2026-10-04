import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HabitacionModule } from './habitacion/habitacion.module.js';
import { ReservaModule } from './reserva/reserva.module.js';

@Module({
  imports: [HabitacionModule, ReservaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
