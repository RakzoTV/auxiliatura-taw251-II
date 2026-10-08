# Guía: conectar NestJS con MySQL (mysql2 + pool de conexiones)

Guía paso a paso para reemplazar datos en memoria por una base de datos MySQL en un proyecto NestJS, usando el CRUD de **habitaciones** como ejemplo.

## Índice

1. [Pasos previos: crear la base de datos](#-pasos-previos-crear-la-base-de-datos)
2. [Paso 1: Instalar el driver de MySQL](#paso-1-instalar-el-driver-de-mysql)
3. [Paso 2: Variables de entorno](#paso-2-variables-de-entorno)
4. [Paso 3: Configurar `ConfigModule`](#paso-3-configurar-configmodule)
5. [Paso 4: Crear el módulo de base de datos](#paso-4-crear-el-módulo-de-base-de-datos)
6. [Paso 5: Registrar el módulo en `AppModule`](#paso-5-registrar-el-módulo-en-appmodule)
7. [Paso 6: Inyectar el pool en el servicio](#paso-6-inyectar-el-pool-en-el-servicio)
8. [Paso 7: Operaciones CRUD](#paso-7-operaciones-crud)
9. [Resumen rápido](#-resumen-rápido)

---

## Pasos previos: crear la base de datos

Primero crea la base de datos y las tablas.

> **Nota:** agrega `AUTO_INCREMENT` a los IDs para que se generen automáticamente. Sin esto, el `INSERT` del CRUD fallará porque no enviamos el ID.

### Tabla `habitaciones`

```sql
CREATE TABLE habitaciones (
    idHabitacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('individual', 'doble', 'suite')),
    precioPorNoche DECIMAL(10, 2) NOT NULL,
    capacidad INT NOT NULL,
    descripcion TEXT
);

INSERT INTO habitaciones (idHabitacion, nombre, tipo, precioPorNoche, capacidad, descripcion) VALUES
(1, 'Habitación Individual', 'individual', 50, 1, 'Una habitación acogedora para una persona.'),
(2, 'Habitación Doble', 'doble', 80, 2, 'Una habitación cómoda para dos personas.'),
(3, 'Suite de Lujo', 'suite', 150, 2, 'Una suite de lujo para dos personas.');
```

### Tabla `reservas`

```sql
CREATE TABLE reservas (
    idReserva INT PRIMARY KEY AUTO_INCREMENT,
    habitacionId INT NOT NULL,
    nombreHuesped VARCHAR(100) NOT NULL,
    fechaCheckIn DATE NOT NULL,
    fechaCheckOut DATE NOT NULL,
    cantidadHuespedes INT NOT NULL,
    precioTotal DECIMAL(10, 2) NOT NULL,
    CHECK (fechaCheckOut > fechaCheckIn),
    FOREIGN KEY (habitacionId) REFERENCES habitaciones(idHabitacion)
);

INSERT INTO reservas (idReserva, habitacionId, nombreHuesped, fechaCheckIn, fechaCheckOut, cantidadHuespedes, precioTotal) VALUES
(1, 1, 'Juan Pérez', '2026-01-01', '2026-01-05', 2, 500),
(2, 2, 'María López', '2026-01-02', '2026-01-06', 1, 300),
(3, 3, 'Carlos García', '2026-01-03', '2026-01-07', 3, 750);
```

---

## Paso 1: Instalar el driver de MySQL

```bash
npm install mysql2
```

---

## Paso 2: Variables de entorno

Instala el módulo de configuración de Nest:

```bash
npm install @nestjs/config
```

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_bd
```

> Agrega `.env` a tu `.gitignore` para no subir credenciales al repositorio.

---

## Paso 3: Configurar `ConfigModule`

En `app.module.ts`, agrega dentro de `imports`:

```ts
ConfigModule.forRoot({
  isGlobal: true,
}),
```

`isGlobal: true` permite usar `ConfigService` en cualquier módulo sin volver a importarlo.

---

## Paso 4: Crear el módulo de base de datos

Crea la carpeta `database/` y dentro el archivo `database.module.ts`:

```ts
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2/promise';

export const DB_POOL = 'DB_POOL';

@Global()
@Module({
  providers: [
    {
      provide: DB_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return createPool({
          host: config.get<string>('DB_HOST') || '',
          port: Number(config.get('DB_PORT')),
          user: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          connectionLimit: 10,
        });
      },
    },
  ],
  exports: [DB_POOL],
})
export class DatabaseModule {}
```

> **Importante:** importa `createPool` desde `mysql2/promise` (no desde `mysql2`) para poder usar `async/await`.

---

## Paso 5: Registrar el módulo en `AppModule`

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // ...otros módulos
  ],
})
export class AppModule {}
```

---

## Paso 6: Inyectar el pool en el servicio

```ts
import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DB_POOL } from '../database/database.module';

@Injectable()
export class HabitacionesService {
  constructor(
    @Inject(DB_POOL) private readonly dbPool: Pool,
  ) {}
}
```

---

## Paso 7: Operaciones CRUD

Convierte los métodos del servicio en funciones **asíncronas** (`async`) y haz las consultas con el pool.

### Entendiendo el resultado de `query`

`query` devuelve un arreglo con dos elementos: `[filas, columnas]`.

| Elemento   | Qué contiene                | ¿Lo necesitamos? |
| ---------- | --------------------------- | ---------------- |
| `filas`    | Los datos de la consulta    | ✅ Sí            |
| `columnas` | Metadata de las columnas    | ❌ No            |

Por eso se desestructura solo el primero:

```ts
const [filas] = await this.dbPool.query('SELECT * FROM habitaciones');
```

Con esto TypeScript no sabe que `filas` es un array, así que no podrías usar `.length` ni otros métodos. Para solucionarlo se usan los **tipos de mysql2**:

| Tipo              | Cuándo usarlo                                                            |
| ----------------- | ------------------------------------------------------------------------ |
| `RowDataPacket[]` | En `SELECT`: devuelve filas que se pueden tratar como array              |
| `ResultSetHeader` | En `INSERT`, `UPDATE`, `DELETE`: da info como `insertId` y `affectedRows` |

```ts
import { RowDataPacket, ResultSetHeader } from 'mysql2';
```

---

### Crear (INSERT)

```ts
async create(createHabitacionDto: CreateHabitacionDto) {
  const [resultado] = await this.dbPool.query<ResultSetHeader>(
    'INSERT INTO habitaciones (nombre, tipo, precioPorNoche, capacidad, descripcion)' +
      ' VALUES (?, ?, ?, ?, ?)',
    [
      createHabitacionDto.nombre,
      createHabitacionDto.tipo,
      createHabitacionDto.precioPorNoche,
      createHabitacionDto.capacidad,
      createHabitacionDto.descripcion,
    ],
  );

  return {
    mensaje: 'habitacion creada',
    id: resultado.insertId,
  };
}
```

> Usa siempre `?` con un arreglo de valores (consultas parametrizadas) para evitar **inyección SQL**.

---

### Listar todas (SELECT)

```ts
async findAll() {
  const [filas] = await this.dbPool.query<RowDataPacket[]>(
    'SELECT * FROM habitaciones',
  );
  return filas;
}
```

---

### Buscar por ID (SELECT ... WHERE)

```ts
async findOne(id: number) {
  const [habitacion] = await this.dbPool.query<RowDataPacket[]>(
    'SELECT * FROM habitaciones WHERE idHabitacion = ?',
    [id],
  );

  if (habitacion.length === 0) {
    throw new NotFoundException('habitacion no encontrada');
  }

  return habitacion[0];
}
```

#### Validar el ID en el controlador

En el controlador se usa `+id` para convertir el texto a número, pero si la petición envía un string (ej. `/habitaciones/abc`) el resultado es `NaN` y se produce un **error 500**.

Para devolver un **error 400** (petición incorrecta), usa `ParseIntPipe`:

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.habitacionesService.findOne(id);
}
```

Con `ParseIntPipe` ya no necesitas el `+id`: Nest convierte y valida el valor automáticamente.

---

### Actualizar (UPDATE)

```ts
async update(id: number, updateHabitacionDto: UpdateHabitacionDto) {
  // findOne ya lanza NotFoundException si no existe
  const habitacion = await this.findOne(id);

  const nuevaHabitacion = { ...habitacion, ...updateHabitacionDto };

  await this.dbPool.query(
    'UPDATE habitaciones SET nombre = ?, tipo = ?, precioPorNoche = ?, capacidad = ?, descripcion = ?' +
      ' WHERE idHabitacion = ?',
    [
      nuevaHabitacion.nombre,
      nuevaHabitacion.tipo,
      nuevaHabitacion.precioPorNoche,
      nuevaHabitacion.capacidad,
      nuevaHabitacion.descripcion,
      id,
    ],
  );

  return {
    mensaje: 'habitacion actualizada',
    nuevaHabitacion,
  };
}
```

> Se combinan los datos actuales con los del DTO (`{ ...habitacion, ...updateHabitacionDto }`) para que las actualizaciones **parciales** no dejen campos en `NULL`.

---

### Eliminar (DELETE)

```ts
async remove(id: number) {
  // findOne ya lanza NotFoundException si no existe
  await this.findOne(id);

  const [resultado] = await this.dbPool.query<ResultSetHeader>(
    'DELETE FROM habitaciones WHERE idHabitacion = ?',
    [id],
  );

  return {
    mensaje: 'habitacion eliminada',
    filas_afectadas: resultado.affectedRows,
  };
}
```

---

## Resumen rápido

| # | Paso                                   | Comando / Archivo                    |
| - | -------------------------------------- | ------------------------------------ |
| 0 | Crear BD y tablas (con `AUTO_INCREMENT`) | MySQL                              |
| 1 | Instalar driver                        | `npm install mysql2`                 |
| 2 | Variables de entorno                   | `npm install @nestjs/config` + `.env` |
| 3 | Configurar `ConfigModule`              | `app.module.ts`                      |
| 4 | Crear pool de conexión                 | `database/database.module.ts`        |
| 5 | Registrar `DatabaseModule`             | `app.module.ts`                      |
| 6 | Inyectar el pool                       | `@Inject(DB_POOL)` en el servicio    |
| 7 | CRUD con `async/await`                 | `RowDataPacket[]` / `ResultSetHeader` |
| + | Validar IDs                            | `ParseIntPipe` en el controlador     |
