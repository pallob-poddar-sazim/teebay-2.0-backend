import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

const MicroOrmConfig: MikroOrmModuleOptions = {
  clientUrl: process.env.DATABASE_URI,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  driver: PostgreSqlDriver,
  debug: true,
  extensions: [Migrator],
  migrations: {
    path: "./src/db/migrations",
    pathTs: "./src/db/migrations",
    glob: "!(*.d).{js,ts}",
    dropTables: false,
    safe: true,
  },
};

export default MicroOrmConfig;
