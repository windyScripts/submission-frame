import path from 'path';

import 'server/lib/config-env';
import { cleanEnv, str, num, bool } from 'envalid';
import {Sequelize} from 'sequelize'

const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_LOGGING: bool({ default: false }),
  DATABASE_URL: str(),
});

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

const commonOptions = {
  dialect: 'postgres',
  models: [path.join(__dirname, '../models/*.model.*')],
  define: {
    underscored: true,
  },
};

class Database {

  constructor(database = env.DB_NAME) {
    this.dbName = database;

    if (env.isProd) {
      this.sequelize = new Sequelize(env.DATABASE_URL, {
        dialectOptions,
        ...commonOptions,
      });
    } else {
      this.sequelize = new Sequelize({
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
        database,
        ...commonOptions,
      });
    }
  }

  // Connect to the postgres db
  async connect() {
    await this.sequelize.authenticate();
    console.log('Connected to db! :)');
  }
}

const Db = new Database();

export {
  Db as default,
  Database,
};