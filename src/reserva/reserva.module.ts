import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service.js';
import { ReservaController } from './reserva.controller.js';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity.js';
import { Habitacion } from '../habitacion/entities/habitacion.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Habitacion]) ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
