/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { NextFunction, Request, Response, Router } from 'express';
import { ImageUploadRequest } from '../data/ImageUploadRequest';
import * as fs from 'fs';
import * as crypto from 'crypto';

class IndexRoute {

  constructor(router: Router) {
    const self = this;
    router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
      self.upload(req, res, next);
    });
  }

  private randomHash(): string {
    const currentDate = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    return crypto.createHash('sha256').update(currentDate + random).digest('hex');
  }

  private extensionFromType(fileType: string) {
    if (fileType === 'JPG') {
      return '.jpg';
    }
    if (fileType === 'PNG') {
      return '.png';
    }
  }

  private upload(req: Request, res: Response, next: NextFunction) {
    const upload = req.body as ImageUploadRequest;
    const fileContentAsBinary = Buffer.from(upload.fileContent, 'base64');
    const filePath = '/u/' + this.randomHash() + this.extensionFromType(upload.fileType);
    fs.writeFileSync(filePath, fileContentAsBinary);
    res.send(JSON.stringify({
      filePath: filePath
    }));
  }
}
export default IndexRoute;
