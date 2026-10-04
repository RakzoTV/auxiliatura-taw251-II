import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service.js';
import { ReservaController } from './reserva.controller.js';

@Module({
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
