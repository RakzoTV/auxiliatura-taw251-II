import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createPool } from "mysql2/promise";

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
