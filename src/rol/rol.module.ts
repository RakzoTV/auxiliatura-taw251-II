import { Module } from '@nestjs/common';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}
