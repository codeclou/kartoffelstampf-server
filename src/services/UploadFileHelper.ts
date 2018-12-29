/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import * as crypto from 'crypto';
import * as fs from 'fs';
import { IntermediateImage } from '../data/IntermediateImage';
import { logger } from './LogService';

export class UploadFileHelper {

  // Dockerized environment has the path setup and writable
  private static TEMPORARY_FILE_PATH = '/u/';
  private static VALID_DATA_URI_REGEX = new RegExp('^data:[-a-z]+/[-a-z]+;base64,[+/=a-zA-Z0-9]+$');
  private static VALID_TEMPORARY_FILENAME_REGEX = new RegExp('^[a-zA-Z0-9]+[.][a-z]+$');

  public static ERROR_FILE_TYPE_NOT_ALLOWED = 'File type not supported.';

  /**
   * @param temporaryFile e.g. 786790989.png
   * @returns e.g. /u/786790989.png
   */
  public static getFullTemporaryFilePath(temporaryFile: string): string {
    return this.TEMPORARY_FILE_PATH + temporaryFile;
  }

  public static getTemporaryFileSizeInBytes(temporaryFile: string): number {
    const fileStats = fs.statSync(this.getFullTemporaryFilePath(temporaryFile));
    return fileStats.size;
  }

  public static isValidTemporaryFileName(temporaryFile: string): boolean {
    if (temporaryFile !== undefined &&
    temporaryFile !== null &&
    temporaryFile.match(this.VALID_TEMPORARY_FILENAME_REGEX)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Stores the uploaded file as binary on the filesystem, so that
   * the commandline tools can process it.
   *
   * @param imageBase64DataUri e.g. data:image/png;base64,iVBORw0KGgoAAAANS...
   * @returns temporary filename e.g. 7689z8979809.png
   */
  public static storeFileTemporary(imageBase64DataUri: string): string {
    const intermediateImage = this.splitDataUriInExtensionAndBase64Part(imageBase64DataUri);
    if (intermediateImage.isAllowedFileType === true) {
      const fileContentAsBinary = Buffer.from(intermediateImage.content, 'base64');
      const fileName = this.randomHash() + intermediateImage.extension;
      fs.writeFileSync(this.TEMPORARY_FILE_PATH + fileName, fileContentAsBinary);
      //
      // Cleanup Task deletes file after 1 hour
      //
      setTimeout(() => {
        try {
          fs.unlinkSync(this.TEMPORARY_FILE_PATH + fileName);
          logger.log('info', 'deleted uploaded file: ', fileName);
        } catch (error) {
          logger.log('info', 'failed to uploaded file: ', fileName);
        }
      }, 3600000); // 1h
      // -
      return fileName;
    } else {
      throw new Error(this.ERROR_FILE_TYPE_NOT_ALLOWED);
    }
  }

  /**
   * @param imageBase64DataUri e.g. data:image/png;base64,iVBORw0KGgoAAAANS...
   */
  public static isValidBase64DataUri(imageBase64DataUri: string): boolean {
    if (imageBase64DataUri !== undefined &&
        imageBase64DataUri !== null &&
        imageBase64DataUri.startsWith('data:') &&
        imageBase64DataUri.match(this.VALID_DATA_URI_REGEX)
    ) {
      return true;
    } else {
      return false;
    }
  }

  public static randomHash(): string {
    const currentDate = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    return crypto.createHash('sha256').update(currentDate + random).digest('hex');
  }

  /**
   * Splits the Base64 Data URI into an IntermediateImage object containing atomic values
   * @param imageBase64DataUri e.g. data:image/png;base64,iVBORw0KGgoAAAANS...
   * @returns { extension: '.png', content: 'iVBORw0KGgoAAAANS...', isAllowedFileType: true }
   */
  public static splitDataUriInExtensionAndBase64Part(imageBase64DataUri: string): IntermediateImage {
    const intermediateImage = new IntermediateImage();
    const intermediateImageParts = imageBase64DataUri.split(',');
    intermediateImage.content = intermediateImageParts[1];
    if (intermediateImageParts[0] === 'data:image/png;base64') {
      intermediateImage.extension = '.png';
      intermediateImage.isAllowedFileType = true;
    } else if (intermediateImageParts[0] === 'data:image/jpg;base64') {
      intermediateImage.extension = '.jpg';
      intermediateImage.isAllowedFileType = true;
    } else if (intermediateImageParts[0] === 'data:image/jpeg;base64') {
      intermediateImage.extension = '.jpg';
      intermediateImage.isAllowedFileType = true;
    } else {
      intermediateImage.extension = '.yyy';
      intermediateImage.isAllowedFileType = false;
    }
    return intermediateImage;
  }
}
