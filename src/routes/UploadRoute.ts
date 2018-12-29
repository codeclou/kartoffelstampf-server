/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { NextFunction, Request, Response, Router } from 'express';
import { ImageUploadRequest } from '../data/ImageUploadRequest';
import { UploadFileHelper } from '../services/UploadFileHelper';

export class UploadRoute {

  constructor(router: Router) {
    const self = this;
    router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
      self.upload(req, res, next);
    });
  }

  private upload(req: Request, res: Response, next: NextFunction) {
    const upload = req.body as ImageUploadRequest;
    if (UploadFileHelper.isValidBase64DataUri(upload.contentDataUri)) {
      try {
        const fileName = UploadFileHelper.storeFileTemporary(upload.contentDataUri);
        res.send(JSON.stringify({fileName}));
      } catch (error) {
        res.status(400).send(JSON.stringify({error: error.message}));
      }
    } else {
      res.status(400).send(JSON.stringify({
        error: 'Invalid Base64 Data URI.',
      }));
    }
  }
}
