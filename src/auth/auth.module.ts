import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsuarioModule } from '../usuario/usuario.module.js';

@Module({
  imports: [UsuarioModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
