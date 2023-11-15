import { cleanEnv, num } from 'envalid';
import express from 'express';

// import routers
import Db from './lib/db';

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
});

class Server {
  app = express();
  port = env.PORT;

  setMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }

  setApiRoutes() {
    // format this.app.use('/routeName', importedRouter);
  }

  async init() {
    this.db = Db;
    await this.db.connect();

    this.setMiddleware();
    this.setApiRoutes();

  }

  start() {
    return new Promise(resolve => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Server started on port ${this.port}`);
        resolve();
      });
    });
  }
}

export default Server;