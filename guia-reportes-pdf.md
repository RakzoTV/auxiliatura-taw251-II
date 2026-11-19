# Guía: generar reportes en PDF en NestJS

Esta guía usa el reporte de **Habitaciones** como ejemplo, pero el mismo patrón sirve para reservas, usuarios o cualquier otra entidad.

## Cómo funciona

1. El cliente hace un `GET` normal, por ejemplo a `/api/reporte/habitaciones`.
2. El servicio consulta los datos en la base de datos, usando el servicio de la entidad.
3. Con **pdfkit** se dibuja el PDF en memoria: títulos, texto, tablas e imágenes.
4. El controlador devuelve el PDF con `StreamableFile` en vez de JSON.

> Aquí **no se usa Multer**. Multer sirve para *recibir* archivos que manda el cliente. Un reporte es al revés: el servidor *genera* el archivo y lo devuelve.

---

## Paso 1: Instalar dependencias

```bash
npm i pdfkit
npm i -D @types/pdfkit
```

- `pdfkit` es la librería que crea el PDF. Desde la versión 0.17 trae `doc.table()` para hacer tablas.
- `@types/pdfkit` da los tipos de TypeScript. Si TypeScript dice que `table` no existe, actualiza los tipos con `npm i -D @types/pdfkit@latest`. El código funciona igual en ejecución, el problema son solo los tipos.

---

## Paso 2: Crear el módulo de reportes

```bash
nest g resource reporte --no-spec
```

Elige **REST API** y responde **No** cuando pregunte si quieres generar el CRUD. Así quedan solo el módulo, el controlador y el servicio vacíos.

---

## Paso 3: Compartir el servicio de Habitación

El reporte necesita leer las habitaciones. En lugar de repetir la consulta, se reutiliza `HabitacionService`.

En `src/habitacion/habitacion.module.ts`, **exporta** el servicio:

```ts
@Module({
  // ...
  providers: [HabitacionService],
  exports: [HabitacionService],   // permite que otros módulos lo usen
})
export class HabitacionModule {}
```

En `src/reporte/reporte.module.ts`, **importa** el módulo:

```ts
import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service.js';
import { ReporteController } from './reporte.controller.js';
import { HabitacionModule } from '../habitacion/habitacion.module.js';

@Module({
  imports: [HabitacionModule],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
```

Si te olvidas del `exports`, Nest lanza el error `Nest can't resolve dependencies of the ReporteService`.

---

## Paso 4: El servicio (armar el PDF)

Archivo `src/reporte/reporte.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { HabitacionService } from '../habitacion/habitacion.service.js';

@Injectable()
export class ReporteService {
  constructor(private readonly habitacionService: HabitacionService) {}

  async reporteHabitaciones(): Promise<Buffer> {
    // 1. Traer los datos
    const habitaciones = await this.habitacionService.findAll();

    // 2. Crear el documento
    const doc = new PDFDocument({ size: 'letter', margin: 50, layout: 'portrait' });

    // 3. Juntar los pedazos del PDF en un Buffer
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const terminado = new Promise<Buffer>((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(chunks))),
    );

    // 4. Contenido
    doc.fontSize(18).text('Reporte de habitaciones', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-BO')}`);
    doc.moveDown();

    // (aquí va la tabla del Paso 5)

    // 5. Cerrar el documento
    doc.end();
    return terminado;
  }
}
```

### Puntos importantes

- **Por qué un Buffer:** pdfkit no entrega el PDF de una sola vez, sino que lo va soltando por pedazos con el evento `data`. Los juntamos en un arreglo, y cuando llega el evento `end` los unimos con `Buffer.concat`. La `Promise` permite hacer `await` hasta que el PDF esté completo.
- **Qué hace `doc.end()`:** cierra el documento. Sin esa línea, nunca se dispara `end` y la petición se queda colgada.
- **Cómo se escribe:** `text()`, `fontSize()` y `moveDown()` escriben de arriba hacia abajo, como en una hoja. `moveDown()` deja una línea en blanco, y `moveDown(0.5)` deja media línea.
- **Tamaños de hoja:** `size` acepta `'letter'`, `'A4'`, `'legal'`, etc.

---

## Paso 5: Mostrar los datos en una tabla

Reemplaza el comentario `(aquí va la tabla del Paso 5)` por:

```ts
doc.table({
  // ancho de cada columna en puntos; '*' reparte el espacio que sobra
  columnStyles: [
    { width: 40, align: 'center' },
    '*',
    90,
    { width: 90, align: 'right' },
    { width: 70, align: 'center' },
  ],

  // estilo por fila: la fila 0 es el encabezado, y el resto se alterna (cebra)
  rowStyles: (i) => {
    if (i === 0) return { backgroundColor: '#1f4e79', textColor: '#ffffff' };
    if (i % 2 === 0) return { backgroundColor: '#eaf1f8' };
  },

  data: [
    ['ID', 'Nombre', 'Tipo', 'Precio/noche', 'Capacidad'],   // encabezado
    ...habitaciones.map((h) => [
      String(h.idHabitacion),
      h.nombre,
      h.tipo,
      `Bs. ${h.precioPorNoche}`,
      String(h.capacidad),
    ]),
  ],
});
```

### Cómo se lee

- **`data`:** es un arreglo de filas, y cada fila es un arreglo de celdas. La primera fila es el encabezado. Con `...habitaciones.map(...)` cada habitación se convierte en una fila.
- **`String(...)`:** convierte los números a texto, porque las celdas esperan texto.
- **`columnStyles`:** puede ser un número (el ancho) o un objeto con `width` y `align` (`'left'`, `'center'` o `'right'`). Los montos y números se leen mejor alineados a la derecha.
- **`rowStyles`:** se ejecuta una vez por fila con su índice `i`. Devuelve el estilo de esa fila, o `undefined` para dejarla normal.
- **Muchas filas:** si no entran en una hoja, la tabla salta sola a la página siguiente.

---

## Paso 6: Orientación de la hoja (vertical u horizontal)

Se define con `layout` al crear el documento:

```ts
// vertical (es el valor por defecto)
new PDFDocument({ size: 'letter', margin: 50, layout: 'portrait' });

// horizontal
new PDFDocument({ size: 'letter', margin: 50, layout: 'landscape' });
```

| Layout      | Tamaño carta (puntos) | Ancho útil con margen 50 |
|-------------|-----------------------|--------------------------|
| `portrait`  | 612 x 792             | ~512                     |
| `landscape` | 792 x 612             | ~692                     |

- Si cambias a horizontal, ajusta los anchos de la tabla. Las columnas con `'*'` ocupan solas el espacio extra.
- Para no calcular el ancho a mano:

```ts
const anchoUtil = doc.page.width - doc.page.margins.left - doc.page.margins.right;
```

- Cada página nueva puede tener su propia orientación. Por ejemplo, una portada vertical y la tabla en horizontal:

```ts
doc.addPage({ layout: 'landscape' });
```

---

## Paso 7: El controlador (devolver el PDF)

Archivo `src/reporte/reporte.controller.ts`:

```ts
import { Controller, Get, StreamableFile } from '@nestjs/common';
import { ApiProduces } from '@nestjs/swagger';
import { ReporteService } from './reporte.service.js';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get('habitaciones')
  @ApiProduces('application/pdf')
  async reporteHabitaciones() {
    const pdf = await this.reporteService.reporteHabitaciones();
    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: 'inline; filename="reporte_habitaciones.pdf"',
    });
  }
}
```

- **`StreamableFile`:** es la forma de NestJS de devolver un archivo en vez de JSON. Pone solo las cabeceras correctas.
- **`disposition`:**
  - Con `inline`, el navegador abre el PDF ahí mismo.
  - Con `attachment; filename="..."`, el PDF se descarga directo.
- **`@ApiProduces('application/pdf')`:** le avisa a Swagger que este endpoint devuelve un PDF.
- Si el endpoint debe estar protegido por roles, ponle los mismos guards y decoradores que a los demás controladores.

---

## Paso 8 (opcional): Poner la foto de la habitación

Como en la BD se guarda solo el nombre del archivo, se arma la ruta igual que en la guía de imágenes:

```ts
import { join } from 'path';
import { existsSync } from 'fs';
import { UPLOADS_DIR } from '../common/multer.config.js';

for (const h of habitaciones) {
  doc.fontSize(12).text(h.nombre);

  const ruta = h.imagen ? join(UPLOADS_DIR, h.imagen) : null;
  if (ruta && existsSync(ruta)) {
    doc.image(ruta, { width: 120 });
  }
  doc.moveDown();
}
```

- **`existsSync`:** evita que el reporte falle si se borró el archivo pero quedó el nombre en la BD.
- **Formatos:** pdfkit solo acepta imágenes **JPG y PNG**. Si alguien subió una `webp` o un `gif`, `doc.image()` lanza un error. Valida el formato antes de agregarla, o limita los formatos en el `fileFilter` de Multer.

---

## Paso 9: Probar

- **Navegador:** abre `http://localhost:3000/api/reporte/habitaciones` y el PDF se muestra directo.
- **Postman:** haz un `GET` a la misma URL. Usa **Send and Download** para guardar el archivo.
- **Swagger:** ejecuta el endpoint y aparece un enlace para descargar el PDF.

---

## Alternativa: puppeteer (HTML a PDF)

Si necesitas reportes con mucho diseño, como logos, colores o tablas con CSS, puedes usar `puppeteer`: armas el reporte en HTML/CSS y él lo convierte a PDF.

| Opción     | Ventajas                                  | Desventajas                                  |
|------------|-------------------------------------------|----------------------------------------------|
| pdfkit     | Liviano, rápido, sin dependencias extra   | El diseño se hace a mano con código          |
| puppeteer  | Diseñas con HTML y CSS, queda más bonito  | Descarga un Chrome (~150 MB), es más lento   |

Para la mayoría de reportes de un proyecto como este, pdfkit alcanza.

---

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Nest can't resolve dependencies of the ReporteService` | `HabitacionService` no está exportado | Agregar `exports: [HabitacionService]` en `HabitacionModule` e importar `HabitacionModule` en `ReporteModule` |
| La petición se queda cargando y nunca responde | Falta `doc.end()` | Llamar a `doc.end()` antes de `return terminado` |
| `Property 'table' does not exist on type 'PDFDocument'` | Los tipos de `@types/pdfkit` están desactualizados | `npm i -D @types/pdfkit@latest` |
| `Unknown image format` | La imagen no es JPG ni PNG | Validar el formato o limitarlo en el `fileFilter` de Multer |
| `ENOENT: no such file or directory` al poner la imagen | El archivo no existe en `uploads/` | Verificar con `existsSync` antes de `doc.image()` |
| El PDF se descarga en vez de abrirse | `disposition` usa `attachment` | Cambiar a `inline` |
| Se ve JSON o un archivo dañado en vez del PDF | Se devolvió el Buffer sin `StreamableFile` | Envolverlo en `new StreamableFile(pdf, { type: 'application/pdf' })` |
| La tabla se corta o queda muy angosta | Los anchos no coinciden con el ancho útil de la hoja | Usar `'*'` en alguna columna o calcular con `doc.page.width` |
