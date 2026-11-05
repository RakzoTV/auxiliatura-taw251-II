import { Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}
    //localhost:3001/auth/login
    @Post("login")
    login(loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @Post("register")
    register(registerDto: RegisterDto){
        return this.authService.register(registerDto)
    }
}
