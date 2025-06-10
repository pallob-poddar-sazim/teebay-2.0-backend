import dotenv from 'dotenv';

class Config {
  public readonly port: number;
  public readonly databaseUri: string;
  public readonly nodeEnv: string;

  constructor() {
    dotenv.config();
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUri = process.env.DATABASE_URI || '';
    this.nodeEnv = process.env.NODE_ENV || 'development';
  }
}

export default new Config();
