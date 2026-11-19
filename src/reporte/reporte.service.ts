import { Injectable } from '@nestjs/common';
import { HabitacionService } from '../habitacion/habitacion.service.js';
import PDFDocument from "pdfkit";

@Injectable()
export class ReporteService {
    constructor(
        private readonly habitacionService: HabitacionService
    ){}

    async reporteHabitaciones() : Promise<Buffer>{
        const habitaciones = await this.habitacionService.findAll();

        const doc = new PDFDocument({size: "letter", margin: 50, layout: "portrait"});

        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk))
        const terminado = new Promise<Buffer>(
            (resolve) => doc.on("end", () => resolve(Buffer.concat(chunks)))
        )

        doc.fontSize(20).text("Reporte de Habitaciones", {align: "center"})
        doc.moveDown();
        doc.fontSize(10).text(`Generado el: ${new Date().toLocaleString("es-BO")}`, {align: "right"})
        doc.moveDown();

        doc.table({
            columnStyles: [
                {width: 40, align: "center"},
                "*",
                90,
                {width: 90, align: "center"},
                {width: 70, align: "center"}
            ],

            rowStyles: (i) => {
                if(i === 0 ) return {backgroundColor: "#1f4e79", textColor: "#ffffff"}
                if(i % 2 === 0) return {backgroundColor: "#eaf2f8"}
            },

            data: [
                ["ID", "Nombre", "Tipo", "Precio por Noche(Bs)", "Capacidad"],
                ...habitaciones.map((h)=> [
                    String(h.idHabitacion),
                    h.nombre,
                    h.tipo,
                    `Bs. ${h.precioPorNoche}`,
                    String(h.capacidad)
                ])
            ]
        })

        doc.end();
        return terminado;
    }

    async reporteReservas(){
        
    }
}
