import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService
    ){}

    async login(loginDto: LoginDto){
        const usuario = await this.usuarioService.findOneByEmail(loginDto.email)
        if(!usuario){
            throw new UnauthorizedException("Ese email no esta registrado")
        }

        const passwordValido = usuario.password === loginDto.password
        if(!passwordValido){
            throw new UnauthorizedException("La constraseña es incorrecta")
        }

        return {
            mensaje: "Login exitoso",
            usuario
        }
    }

    async register(registerDto: RegisterDto){
        return "register"
    }
}
