import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService
    ){}

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.findOneByEmailWithPasswordAndRoles(loginDto.email)
        if(!usuario){
            throw new UnauthorizedException("El email no esta registrado")
        }

        const contraseñaValida = await bcrypt.compare(loginDto.password, usuario.password)
        if(!contraseñaValida){
            throw new UnauthorizedException("Contraseña incorrecta")
        }

        const payload = {
            idUsuario: usuario.idUsuario,
            usuario: usuario.username,
            email: usuario.email,
            roles: usuario.roles.map((rol) => rol.rol.nombreRol)
        }

        const token = await this.jwtService.signAsync(payload)



        return {
            mensaje: "login exitoso",
            token: token,
            usuario: usuario.username,
            email: usuario.email,
            roles: usuario.roles.map((rol) => rol.rol.nombreRol)
        }
    }

    async register(registerDto: CreateUsuarioDto){
        const usuario = await this.usuarioService.findOneByEmail(registerDto.email)
        if(usuario){
            throw new BadRequestException("El email ya esta registrado")
        }

        const constraseñaHash = await bcrypt.hash(registerDto.password, 10)

        const newUsuario = await this.usuarioService.createLogin({
            ...registerDto,
            password: constraseñaHash
        })

        return {
            mensaje: "Usuario registrado correctamente",
            usuario: newUsuario
        }
    }
}
