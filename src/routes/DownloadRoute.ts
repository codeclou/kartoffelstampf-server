/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { UploadFileHelper } from '../services/UploadFileHelper';

export class DownloadRoute {

  constructor(router: Router) {
    const self = this;
    router.get('/download/:temporaryFileName/:originalFileName', (req: Request, res: Response, next: NextFunction) => {
      self.download(req, res, next);
    });
  }

  private download(req: Request, res: Response, next: NextFunction) {
    const temporaryFileName: string = req.params.temporaryFileName;
    const originalFileName: string = req.params.originalFileName;
    if (UploadFileHelper.isValidTemporaryFileName(temporaryFileName)) {
      res.download(UploadFileHelper.getFullTemporaryFilePath(temporaryFileName), originalFileName);
    } else {
      res.status(400).send(JSON.stringify({
        error: 'Invalid temporaryFileName.',
      }));
    }
  }
}
