/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { NextFunction, Request, Response, Router } from 'express';

class IndexRoute {

  constructor(router: Router) {
    const self = this;
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      self.index(req, res, next);
    });
  }

  private index(req: Request, res: Response, next: NextFunction) {
    const options: Object = {
      message: 'welcome',
      title: 'Index',
    };
    res.render('index', options);
  }
}
export default IndexRoute;
