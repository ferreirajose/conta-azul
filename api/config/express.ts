import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Routes } from '../app/routes/index';

export default class Express {

  private app: express.Application;
  private routePrv: Routes;

  constructor() {
    this.app = express();
    this.config();
    this.routePrv = new Routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // serving static files
    this.app.use(express.static('src/app/assets'));

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  public express(): express.Application {
    return this.app;
  }

  // public routes() {
  //   this.routePrv.routes();
  // }

}

// export default new Express().app;
