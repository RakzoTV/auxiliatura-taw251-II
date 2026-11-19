# Guía: subir, actualizar, renombrar y borrar imágenes en NestJS

Esta guía usa el módulo **Habitación** como ejemplo, pero el mismo patrón sirve para Producto, Usuario o cualquier otra entidad.

## Cómo funciona

1. El cliente manda la petición como `multipart/form-data`, que es el formato para enviar archivos.
2. **Multer** recibe el archivo y lo guarda en la carpeta `uploads/`. Multer ya viene con `@nestjs/platform-express`.
3. En la base de datos se guarda **solo el nombre del archivo**, nunca la ruta completa.
4. Nest sirve la carpeta `uploads/` como archivos estáticos, así que la imagen se ve en `http://localhost:3000/uploads/<nombre>`.

---

## Paso 1: Instalar dependencias

```bash
npm i multer
npm i -D @types/multer
```

- `multer` conviene instalarlo **como dependencia directa**, aunque `@nestjs/platform-express` ya lo traiga por dentro. Así tu `package.json` declara lo que tu código importa y no dependes de cómo el gestor organice `node_modules`. Si no está, puede aparecer el error `ERR_MODULE_NOT_FOUND: Cannot find package 'multer'`.
- `@types/multer` da los tipos de TypeScript, como `Express.Multer.File`.

Como el `tsconfig.json` limita los tipos globales, también hay que agregar `multer` ahí:

```json
"types": ["vitest/globals", "node", "multer"]
```

> Usa un solo gestor de paquetes. Si usas npm, el proyecto solo debe tener `package-lock.json`. Si existe un `pnpm-lock.yaml` o una carpeta `node_modules/.pnpm`, borra `pnpm-lock.yaml` y `node_modules`, y vuelve a correr `npm install`.

---

## Paso 2: Configuración de Multer reutilizable

Archivo `src/common/multer.config.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

export const imageMulterOptions = {
  storage: diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      // nombre temporal único; el servicio lo renombra después
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    },
  }),
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(new BadRequestException('Solo se permiten imágenes (jpg, png, webp, gif)'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
};
```

- `diskStorage` define **dónde** se guarda el archivo y **con qué nombre**.
- `fileFilter` rechaza todo lo que no sea una imagen.
- `limits` pone un tamaño máximo.
- Se usa `process.cwd()` en lugar de `__dirname` porque el proyecto es ESM (`"type": "module"`) y ahí `__dirname` no existe.
- Si la carpeta `uploads` no existe, Multer la crea solo.

---

## Paso 3: Servir la carpeta como archivos estáticos

En `src/main.ts`:

```ts
import { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOADS_DIR } from './common/multer.config.js';

const app = await NestFactory.create<NestExpressApplication>(AppModule);

app.setGlobalPrefix('api');
app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads' });
```

Esta configuración crea una regla: *"cuando alguien pida `/uploads/<algo>`, busca `<algo>` dentro de la carpeta `UPLOADS_DIR`"*. La ruta **no** lleva `/api`, porque el prefijo global no se aplica a los archivos estáticos.

Agrega también `/uploads` al `.gitignore` para no subir las imágenes al repositorio.

---

## Paso 4: Columna en la entidad

```ts
@Column({ type: 'varchar', nullable: true })
imagen: string | null;
```

- `nullable: true` le dice a la **base de datos** que la columna puede estar vacía.
- `string | null` le dice lo mismo a **TypeScript**. Las dos partes tienen que coincidir. Si falta el `| null`, sale el error *"El tipo 'string | null' no se puede asignar al tipo 'string | undefined'"*.
- `type: 'varchar'` es obligatorio. Con un tipo unión como `string | null`, TypeORM no puede deducir solo qué tipo de columna crear.

Con `synchronize: true`, la columna se crea sola al reiniciar el servidor.

---

## Paso 5: Ajustar el DTO (campos numéricos)

Con `multipart/form-data`, **todos los campos llegan como texto** (`"25"` en vez de `25`). Para que pasen validaciones como `@IsNumber()`, hay que convertirlos:

```ts
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Type(() => Number)
@IsNumber()
precioPorNoche: number;
```

Esto funciona porque el `ValidationPipe` tiene `transform: true`. Haz lo mismo en cada campo numérico o booleano de los DTOs que reciban archivos.

---

## Paso 6: El controlador

```ts
import { Controller, Post, Patch, Body, Param, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { imageMulterOptions } from '../common/multer.config.js';

@Post()
@UseInterceptors(FileInterceptor('imagen', imageMulterOptions))
@ApiConsumes('multipart/form-data')
create(
  @Body() dto: CreateHabitacionDto,
  @UploadedFile() imagen?: Express.Multer.File,
) {
  return this.habitacionService.create(dto, imagen);
}

@Patch(':id')
@UseInterceptors(FileInterceptor('imagen', imageMulterOptions))
@ApiConsumes('multipart/form-data')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateHabitacionDto,
  @UploadedFile() imagen?: Express.Multer.File,
) {
  return this.habitacionService.update(id, dto, imagen);
}
```

- `FileInterceptor('imagen', ...)`: `'imagen'` es el **nombre del campo** del form-data donde viene el archivo.
- `@UploadedFile()` entrega el archivo ya guardado, con `filename`, `size`, `mimetype`, etc.
- `@ApiConsumes` hace que Swagger y Scalar muestren un botón para elegir el archivo.

---

## Paso 7: El servicio (crear, renombrar y actualizar)

### ¿Por qué se renombra en el servicio y no en Multer?

La función `filename` de Multer se ejecuta **antes** de llegar al servicio:

- **Al crear, todavía no existe el `id`**, porque el registro aún no se guardó.
- **`req.body` puede venir incompleto**: Multer solo ve los campos que llegaron *antes* del archivo en el form-data.

Por eso Multer guarda el archivo con un nombre temporal (un UUID), y el servicio lo **renombra** cuando ya tiene el `id` y los datos validados.

### Código

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { rename, unlink } from 'fs/promises'; // usar 'fs/promises', NO 'fs'
import { extname, join } from 'path';
import { UPLOADS_DIR } from '../common/multer.config.js';

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
  ) {}

  // Genera un nombre con los datos de la habitación y mueve el archivo
  private async renombrarImagen(habitacion: Habitacion, archivo: Express.Multer.File) {
    const ext = extname(archivo.filename);
    const slug = habitacion.nombre
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .toLowerCase().replace(/[^a-z0-9]+/g, '-');      // solo letras, números y guiones
    const nombre = `habitacion_${habitacion.idHabitacion}_${slug}_${Date.now()}${ext}`;

    await rename(join(UPLOADS_DIR, archivo.filename), join(UPLOADS_DIR, nombre));
    return nombre;
  }

  async create(dto: CreateHabitacionDto, imagen?: Express.Multer.File) {
    let habitacion = this.habitacionRepository.create(dto);
    habitacion = await this.habitacionRepository.save(habitacion); // ahora ya hay id

    if (imagen) {
      habitacion.imagen = await this.renombrarImagen(habitacion, imagen);
      habitacion = await this.habitacionRepository.save(habitacion);
    }
    return habitacion;
  }

  async findOne(id: number) {
    const habitacion = await this.habitacionRepository.findOneBy({ idHabitacion: id });
    if (!habitacion) throw new NotFoundException('Habitación no encontrada');
    return habitacion;
  }

  async update(id: number, dto: UpdateHabitacionDto, imagen?: Express.Multer.File) {
    const habitacion = await this.findOne(id);
    Object.assign(habitacion, dto);

    if (imagen) {
      // borrar la imagen anterior para no dejar basura en el disco
      if (habitacion.imagen) {
        await unlink(join(UPLOADS_DIR, habitacion.imagen)).catch(() => {});
      }
      habitacion.imagen = await this.renombrarImagen(habitacion, imagen);
    }
    return await this.habitacionRepository.save(habitacion);
  }
}
```

### Puntos importantes

- **Importa desde `'fs/promises'`, no desde `'fs'`.** El `rename` de `'fs'` funciona con *callback* y no devuelve una promesa, así que el `await` no hace nada. El editor lo avisa con *"await no tiene efecto en el tipo de esta expresión"*.
- **Limpia el texto antes de usarlo en el nombre del archivo (el "slug").** Si el nombre tiene espacios, tildes, `/` o `..`, el `rename` puede fallar o escribir fuera de `uploads/`.
- **Agrega `Date.now()` al nombre.** Así no se pisan archivos, y el navegador no muestra la imagen vieja guardada en caché después de actualizarla.
- **Al actualizar sin imagen**, se conserva la anterior y solo cambian los demás campos.
- **`.catch(() => {})`** evita que la petición falle si el archivo viejo ya no existía.

---

## Paso 8: Borrado de la habitación y su foto

**Regla general:** la foto vive mientras el registro pueda volver a usarse.

### Borrado físico: sí, borra la foto

```ts
async remove(id: number) {
  const habitacion = await this.findOne(id); // leer ANTES de borrar para saber el nombre

  // 1. primero borrar en la BD
  await this.habitacionRepository.delete(id);

  // 2. después borrar el archivo
  if (habitacion.imagen) {
    await unlink(join(UPLOADS_DIR, habitacion.imagen)).catch(() => {});
  }

  return { message: 'Habitación eliminada' };
}
```

**¿Por qué en ese orden?** El `delete` puede fallar, por ejemplo si la habitación tiene reservas relacionadas (*foreign key*).

| Orden | Si algo falla… |
| --- | --- |
| Foto → BD | La habitación sigue existiendo **sin imagen**. (incorrecto) |
| BD → Foto | Solo queda un archivo suelto en el disco; no rompe nada. (correcto) |

### Soft delete: no borres la foto

Con soft delete el registro **se puede restaurar**. Si borras la foto, la habitación volvería con un nombre de archivo que ya no existe.

**Entidad:**

```ts
import { DeleteDateColumn } from 'typeorm';

@DeleteDateColumn()
deletedAt: Date | null;
```

**Servicio:**

```ts
async remove(id: number) {
  await this.findOne(id);
  await this.habitacionRepository.softDelete(id); // solo llena deletedAt
  return { message: 'Habitación desactivada' };
}

async restore(id: number) {
  await this.habitacionRepository.restore(id); // vuelve a poner deletedAt en null
  return { message: 'Habitación restaurada' };
}
```

- Con `@DeleteDateColumn`, los métodos `find` y `findOneBy` **ocultan automáticamente** los registros eliminados.
- La foto solo se borra si más adelante haces una **limpieza definitiva**, por ejemplo eliminar físicamente las habitaciones con `deletedAt` de hace más de X días. En ese caso se usa el mismo código del borrado físico: primero la base de datos y después el archivo.

---

## Paso 9: Probar

**Postman:**

1. Haz un `POST http://localhost:3000/api/habitacion`.
2. En Body, elige **form-data**.
3. Agrega los campos de texto como *Text*.
4. Agrega `imagen` cambiando el tipo a **File** y elige una imagen.
5. Para actualizar, haz un `PATCH /api/habitacion/1` con la misma estructura. Puedes mandar solo la imagen, solo campos de texto, o ambos.
6. Abre `http://localhost:3000/uploads/<nombre-devuelto>` para ver la imagen.

**Swagger:** en `/docs` aparece el campo `imagen` con un botón para elegir el archivo.

---

## ¿Cómo encuentra el servidor la imagen si solo se guarda el nombre?

La base de datos **no busca nada**; solo guarda texto. La carpeta la conoce el servidor por `UPLOADS_DIR`:

```
1. BD devuelve:           imagen = "habitacion_5_suite-doble_1731968021.png"
2. Front arma la URL:     http://localhost:3000/uploads/habitacion_5_suite-doble_1731968021.png
3. Nest recibe la ruta:   /uploads/habitacion_5_suite-doble_1731968021.png
4. Nest busca el archivo: <proyecto>/uploads/habitacion_5_suite-doble_1731968021.png
5. Lo envía al navegador
```

**¿Por qué solo el nombre?**

- Si cambias de carpeta o de servidor, modificas `UPLOADS_DIR` en un solo lugar y no tienes que actualizar los registros.
- Una ruta como `C:\...` deja de servir apenas despliegas en otro equipo.
- No expones la estructura de carpetas del servidor.

**Opcional: devolver la URL completa desde la API:**

```ts
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

return {
  ...habitacion,
  imagenUrl: habitacion.imagen ? `${BASE_URL}/uploads/${habitacion.imagen}` : null,
};
```

---

## Errores comunes

| Error | Causa | Solución |
| --- | --- | --- |
| `ERR_MODULE_NOT_FOUND: Cannot find package 'multer'` | `multer` no está como dependencia directa, o `node_modules` fue instalado con otro gestor | `npm i multer` (si hace falta, borrar `node_modules` y correr `npm install`) |
| `Express.Multer.File` no existe | Falta `multer` en `"types"` del tsconfig, o falta `@types/multer` | Agregarlo en ambos lugares |
| `'string \| null' no se puede asignar a 'string \| undefined'` | La entidad no permite `null` en `imagen` | `imagen: string \| null` con `nullable: true` |
| `precio must be a number` | En form-data todo llega como texto | `@Type(() => Number)` en el DTO |
| `"await" no tiene efecto…` | `rename` importado desde `'fs'` | Importar desde `'fs/promises'` |
