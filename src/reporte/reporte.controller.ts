import { Controller, Get, StreamableFile } from '@nestjs/common';
import { ReporteService } from './reporte.service.js';
import { ApiProduces } from '@nestjs/swagger';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get("habitaciones")
  @ApiProduces("application/pdf")
  async reportehabitaciones(){
    const pdf = await this.reporteService.reporteHabitaciones();
    return new StreamableFile(pdf, {
      type: "application/pdf",
      disposition: "inline; filename=reporte_habitaciones.pdf"
    })
  }
}
