import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import config from "./src/config";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

const MicroOrmConfig: MikroOrmModuleOptions = {
  dbName: config.postgresDB,
  user: config.postgresUser,
  password: config.postgresPassword,
  host: config.dbHost,
  port: 5432,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  driver: PostgreSqlDriver,
  debug: true,
  extensions: [Migrator],
  migrations: {
    path: "./migrations",
    pathTs: "./migrations",
    glob: "!(*.d).{js,ts}",
    dropTables: false,
    safe: true,
  },
};

export default MicroOrmConfig;
