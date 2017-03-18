/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import GenericError from './error/GenericError';
import IndexRoute from './routes/IndexRoute';

class Server {

  private app: express.Application;

  constructor(port: Number) {
    this.app = express();
    this.app.set('port', port);

    // INIT
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'pug');
    this.app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../public')));

    // ROUTES
    this.routes();

    // catch 404 and forward to error handler
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const err = new GenericError('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

  public getApp() {
    return this.app;
  }

  private routes() {
    let router: express.Router;
    router = express.Router();

    new IndexRoute(router);

    this.app.use(router);
  }
}
export default Server;
