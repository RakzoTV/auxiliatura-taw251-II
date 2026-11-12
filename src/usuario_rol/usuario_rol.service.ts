import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioRolDto } from './dto/create-usuario_rol.dto.js';
import { UpdateUsuarioRolDto } from './dto/update-usuario_rol.dto.js';
import { Repository } from 'typeorm';
import { UsuarioRol } from './entities/usuario_rol.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../rol/entities/rol.entity.js';
import { Usuario } from '../usuario/entities/usuario.entity.js';

@Injectable()
export class UsuarioRolService {
  
  constructor(
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepository: Repository<UsuarioRol>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ){}

  async create(createUsuarioRolDto: CreateUsuarioRolDto) {
    const usuario = await this.usuarioRepository.findOneBy({
      idUsuario: createUsuarioRolDto.idUsuario
    });

    if(!usuario){
      throw new NotFoundException("El usuario no existe")
    }

    const rol = await this.rolRepository.findOneBy({
      idRol: createUsuarioRolDto.idRol
    })

    if(!rol){
      throw new NotFoundException("El rol no existe")
    }

    const usuarioRol = this.usuarioRolRepository.create({
      ...createUsuarioRolDto,
      idUsuario: usuario.idUsuario,
      idRol: rol.idRol
    })

    return await this.usuarioRolRepository.save(usuarioRol)

  }

  async findAll() {
    return await this.usuarioRolRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} usuarioRol`;
  }

  update(id: number, updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return `This action updates a #${id} usuarioRol`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuarioRol`;
  }
}
