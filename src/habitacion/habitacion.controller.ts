import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HabitacionService } from './habitacion.service.js';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { TipoRol } from '../rol/entities/rol.entity.js';


@Controller('habitacion')
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  @Post()
  //@Auth([TipoRol.ADMIN])
  @ApiOperation({ summary: "Crea una nueva habitacion"})
  create(@Body() createHabitacionDto: CreateHabitacionDto) {
    return this.habitacionService.create(createHabitacionDto);
  }

  @Get()
  @ApiOperation({ summary: "Obtiene todas las habitaciones"})
  findAll() {
    return this.habitacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHabitacionDto: UpdateHabitacionDto) {
    return this.habitacionService.update(id, updateHabitacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.remove(id);
  }
}
