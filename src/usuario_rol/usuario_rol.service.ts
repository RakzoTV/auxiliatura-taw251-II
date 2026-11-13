import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioRolDto } from './dto/create-usuario_rol.dto.js';
import { UpdateUsuarioRolDto } from './dto/update-usuario_rol.dto.js';
import { Repository } from 'typeorm';
import { UsuarioRol } from './entities/usuario_rol.entity.js';
import { Usuario } from '../usuario/entities/usuario.entity.js';
import { Rol } from '../rol/entities/rol.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioRolService {

  constructor(
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepo: Repository<UsuarioRol>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ){}

  async create(createUsuarioRolDto: CreateUsuarioRolDto) {
    const usuario = await this.usuarioRepo.findOneBy({idUsuario: createUsuarioRolDto.idUsuario})
    if(!usuario){
      throw new NotFoundException("No existe el usuario")
    }

    const rol = await this.rolRepo.findOneBy({idRol: createUsuarioRolDto.idRol})
    if(!rol){
      throw new NotFoundException("No existe el rol")
    }

    const usuarioRol = this.usuarioRolRepo.create({
      ...createUsuarioRolDto,
      idUsuario: usuario.idUsuario,
      idRol: rol.idRol
    })

    return this.usuarioRolRepo.save(usuarioRol)
  }

  findAll() {
    return `This action returns all usuarioRol`;
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
