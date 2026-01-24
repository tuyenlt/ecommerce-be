
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export function getConfig() {
  return {
    type: process.env.DATABASE_ENGINE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ["src/**/*.entity{.ts,.js}"],
    synchronize: false,
    migrationsRun: true,
    migrations: ["database/migrations/**/*{.ts,.js}"],
    subscribers: ["src/migrations"],
    seeds: ["database/seeds/**/*{.ts,.js}"],
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  } as any;
}

const datasource = new DataSource(getConfig());

datasource.initialize();

export default datasource;
