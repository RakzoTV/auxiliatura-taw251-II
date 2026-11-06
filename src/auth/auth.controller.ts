import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post("login")
    login(@Body() loginDto: LoginDto ) {
        return this.authService.login(loginDto);
    }

    @Post("register")
    register(@Body() registerDto: CreateUsuarioDto){
        return this.authService.register(registerDto);
    }

    @Get("prueba")
    @UseGuards(AuthGuard)
    prueba(@Request() req: any ){
        return req.user
    }
}
