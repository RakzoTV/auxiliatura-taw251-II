import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {

    const existeUsuario = await this.findOneByEmail(createUsuarioDto.email)
    if(existeUsuario){
      throw new BadRequestException("El email ya esta registrado")
    }

    const constraseñaHash = await bcrypt.hash(createUsuarioDto.password, 10)

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: constraseñaHash
    });
    return await this.usuarioRepository.save(usuario);
  }

  async createLogin(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async findOneByEmail(email: string) : Promise<Usuario | null> {
    return await this.usuarioRepository.findOneBy({email})
    // por atras el findOneBy hace un Select * from usuario where email = email
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
