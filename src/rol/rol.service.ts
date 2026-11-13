import { Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolService {

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ){}

  async create(createRolDto: CreateRolDto) {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  async findAll() {
    return await this.rolRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} rol`;
  }

  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} rol`;
  }

  remove(id: number) {
    return `This action removes a #${id} rol`;
  }
}
