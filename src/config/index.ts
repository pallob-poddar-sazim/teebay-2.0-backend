import dotenv from 'dotenv';

class Config {
  public readonly port: number;
  public readonly databaseUri: string;
  public readonly nodeEnv: string;
  public readonly postgresDB: string;
  public readonly postgresUser: string;
  public readonly postgresPassword: string;

  constructor() {
    dotenv.config();
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUri = process.env.DATABASE_URI || '';
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.postgresDB = process.env.POSTGRES_DB || '';
    this.postgresUser = process.env.POSTGRES_USER || '';
    this.postgresPassword = process.env.POSTGRES_PASSWORD || '';
  }
}

export default new Config();
