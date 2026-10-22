import { Module } from '@nestjs/common';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';

@Module({
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}
