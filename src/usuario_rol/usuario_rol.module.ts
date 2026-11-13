import { Module } from '@nestjs/common';
import { UsuarioRolService } from './usuario_rol.service.js';
import { UsuarioRolController } from './usuario_rol.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRol } from './entities/usuario_rol.entity.js';
import { Usuario } from '../usuario/entities/usuario.entity.js';
import { Rol } from '../rol/entities/rol.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioRol, Usuario, Rol])],
  controllers: [UsuarioRolController],
  providers: [UsuarioRolService],
})
export class UsuarioRolModule {}
