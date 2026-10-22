import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HabitacionModule } from './habitacion/habitacion.module.js';
import { ReservaModule } from './reserva/reserva.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module.js';
import { RolModule } from './rol/rol.module.js';
import { DetalleHabitacionModule } from './detalle_habitacion/detalle_habitacion.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST"),
        port: Number(config.get("DB_PORT")),
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_NAME"),
        autoLoadEntities: true,
        synchronize: true, //solo en desarrollo, en produccion falso
      })
    }),
    //DatabaseModule,
    HabitacionModule,
    ReservaModule,
    UsuarioModule,
    RolModule,
    DetalleHabitacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
