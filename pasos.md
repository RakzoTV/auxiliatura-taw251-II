Pasos a seguir

Pasos previos:
Crear la bd y las tablas en la bd

Para habitaciones:
CREATE TABLE habitaciones (
    idHabitacion INT PRIMARY KEY,
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

Para reservas:
CREATE TABLE reservas (
    idReserva INT PRIMARY KEY,
    habitacionId INT NOT NULL,
    nombreHuesped VARCHAR(100) NOT NULL,
    fechaCheckIn DATE NOT NULL,
    fechaCheckOut DATE NOT NULL,
    cantidadHuespedes INT NOT NULL,
    precioTotal DECIMAL(10, 2) NOT NULL,
    CHECK (fechaCheckOut > fechaCheckIn)
);

INSERT INTO reservas (idReserva, habitacionId, nombreHuesped, fechaCheckIn, fechaCheckOut, cantidadHuespedes, precioTotal) VALUES
(1, 1, 'Juan Pérez', '2026-01-01', '2026-01-05', 2, 500),
(2, 2, 'María López', '2026-01-02', '2026-01-06', 1, 300),
(3, 3, 'Carlos García', '2026-01-03', '2026-01-07', 3, 750);

NOTA: poner AUTO_INCREMENT en el ID para que el ID sea auto incremental


Paso 1:
Instalar el driver de mysql
npm install mysql2

Paso 2:
Crear el archivo .env e instalar config
npm install @nestjs/config

Paso 3:
Configurar el app.module para que sirva el config
Agregar en el imports lo siguiente:
ConfigModule.forRoot({
      isGlobal: true
    }),

Paso 4:
Configurar el archivo de pool de conexion
Crearse la carpeta database y dentro en archivo database.module.ts
export const DB_POOL = "DB_POOL"

@Global()
@Module({
    providers: [
        {
            provide: DB_POOL,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return createPool({
                    host: config.get<string>("DB_HOST") || "",
                    port: Number(config.get("DB_PORT")),
                    user: config.get<string>("DB_USER"),
                    password: config.get<string>("DB_PASSWORD"),
                    database: config.get<string>("DB_NAME"),
                    connectionLimit: 10
                })
            }
        }
    ],
    exports: [DB_POOL]
})

export class DatabaseModule {}

Paso 5:
Llamar el database.module en app.module

Paso 6:
Inyectar en el servicio

import type { Pool } from 'mysql2/promise';

constructor(
    @Inject(DB_POOL) private readonly dbPool: Pool
  ){}


Paso 7:
Convertir las funciones en funciones asincronas y luego hacer la llamada haciendo uso del pool

generalmente al llamar vienen dos cosas [filas, columnas] las filas son los datos y columnas metadata que no necesitamos
manipular

const [filas] = await this.dbPool.query
    ("SELECT * FROM habitaciones");

ahora cuando hacemos la llamada cuando trae los datos ts no sabe que lo trae como un array 
por eso no podemos hacer nada con el no podemos usar .length u otra funcion de array
Para eso esta el RowDataPacket que nos va a ayudar a eso

const [filas] = await this.dbPool.query<RowDataPacket[]>
    ("SELECT * FROM habitaciones");

Tambien existe ResultSetHeader para solo mandar mensaje al eliminar o actualizar por ejemplo

para insertar:
const [resultado] = await this.dbPool.query<ResultSetHeader>(
      "INSERT INTO habitaciones(nombre, tipo, precioPorNoche, capacidad, descripcion)" + 
      " VALUES (?,?,?,?,?)", 
      [createHabitacionDto.nombre,
      createHabitacionDto.tipo,
      createHabitacionDto.precioPorNoche,
      createHabitacionDto.capacidad,
      createHabitacionDto.descripcion
      ]
    )

para encontrar por id:
    const [habitacion] = await this.dbPool.query<RowDataPacket[]>
    ("SELECT * FROM habitaciones WHERE idHabitacion = ?", [id])

    if (habitacion.length === 0){
      throw new NotFoundException("habitacion no encontrada")
    }

    return habitacion[0]

hay que tener encuenta que en el controlador usa +id para transformar el texto a numero
pero si mandamos en la peticion un string va a mandar un NaN y generar un error 500
entonces para evitar eso y que nos mande un error 400 hay que modificar en el controlador para que use ParsePipeInt

para actualizar:
const habitacion = await this.findOne(id);

    const nuevaHabitacion = {...habitacion, ...updateHabitacionDto}
    await this.dbPool.query(
      "UPDATE habitaciones SET nombre = ?, tipo = ?, precioPorNoche = ?, capacidad = ?, descripcion = ?" +
      " WHERE idHabitacion = ?",
      [nuevaHabitacion.nombre, 
        nuevaHabitacion.tipo, 
        nuevaHabitacion.precioPorNoche, 
        nuevaHabitacion.capacidad, 
        nuevaHabitacion.descripcion, 
        id]
    )

    return {
      mensaje: "habitacion actualizada",
      nuevaHabitacion: nuevaHabitacion
    }

para eliminar:
const habitacion = await this.findOne(id);

    const [resultado] = await this.dbPool.query<ResultSetHeader>
    ("DELETE FROM habitaciones WHERE idHabitacion = ?", [id]);  

    return {
      mensaje: "habitacion eliminada",
      filas_afectadas: resultado.affectedRows
    }

