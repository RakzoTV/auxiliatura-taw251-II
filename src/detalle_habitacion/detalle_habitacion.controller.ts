import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleHabitacionService } from './detalle_habitacion.service.js';
import { CreateDetalleHabitacionDto } from './dto/create-detalle_habitacion.dto.js';
import { UpdateDetalleHabitacionDto } from './dto/update-detalle_habitacion.dto.js';

@Controller('detalle-habitacion')
export class DetalleHabitacionController {
  constructor(private readonly detalleHabitacionService: DetalleHabitacionService) {}

  @Post()
  create(@Body() createDetalleHabitacionDto: CreateDetalleHabitacionDto) {
    return this.detalleHabitacionService.create(createDetalleHabitacionDto);
  }

  @Get()
  findAll() {
    return this.detalleHabitacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleHabitacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleHabitacionDto: UpdateDetalleHabitacionDto) {
    return this.detalleHabitacionService.update(+id, updateDetalleHabitacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleHabitacionService.remove(+id);
  }
}
