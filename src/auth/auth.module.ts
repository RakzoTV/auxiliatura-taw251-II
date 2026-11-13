import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsuarioModule } from '../usuario/usuario.module.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants.js';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1h" }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
