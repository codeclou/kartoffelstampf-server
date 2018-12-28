/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';

class DownloadRoute {

  constructor(router: Router) {
    const self = this;
    router.get('/download/:file', (req: Request, res: Response, next: NextFunction) => {
      self.download(req, res, next);
    });
  }

  private download(req: Request, res: Response, next: NextFunction) {
    const fileName: string = req.params.file;
    // FIXME: sanitize filename
    res.download('/u/' + fileName);
  }
}
export default DownloadRoute;
