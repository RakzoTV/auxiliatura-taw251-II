import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service.js';
import { ReservaController } from './reserva.controller.js';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
