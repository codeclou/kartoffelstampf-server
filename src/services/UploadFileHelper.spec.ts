/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */

import { expect } from 'chai';
import { UploadFileHelper } from './UploadFileHelper';

describe('UploadFileHelper', () => {
  it('splitDataUriInExtensionAndBase64Part() valid PNG Data URI', () => {
    const intermediateImage = UploadFileHelper
      .splitDataUriInExtensionAndBase64Part('data:image/png;base64,iVBORw0KGgoAAAANS');
    expect(intermediateImage.content).to.equal('iVBORw0KGgoAAAANS');
    expect(intermediateImage.isAllowedFileType).to.equal(true);
    expect(intermediateImage.extension).to.equal('.png');
  });
  it('splitDataUriInExtensionAndBase64Part() valid JPG Data URI', () => {
    const intermediateImage = UploadFileHelper
      .splitDataUriInExtensionAndBase64Part('data:image/jpg;base64,iVBORw0KGgoAAAANS');
    expect(intermediateImage.content).to.equal('iVBORw0KGgoAAAANS');
    expect(intermediateImage.isAllowedFileType).to.equal(true);
    expect(intermediateImage.extension).to.equal('.jpg');
  });
  it('splitDataUriInExtensionAndBase64Part() valid JPEG Data URI', () => {
    const intermediateImage = UploadFileHelper
      .splitDataUriInExtensionAndBase64Part('data:image/jpeg;base64,iVBORw0KGgoAAAANS');
    expect(intermediateImage.content).to.equal('iVBORw0KGgoAAAANS');
    expect(intermediateImage.isAllowedFileType).to.equal(true);
    expect(intermediateImage.extension).to.equal('.jpg');
  });
  it('splitDataUriInExtensionAndBase64Part() invalid GIF Data URI', () => {
    const intermediateImage = UploadFileHelper
      .splitDataUriInExtensionAndBase64Part('data:image/gif;base64,iVBORw0KGgoAAAANS');
    expect(intermediateImage.content).to.equal('iVBORw0KGgoAAAANS');
    expect(intermediateImage.isAllowedFileType).to.equal(false);
    expect(intermediateImage.extension).to.equal('.yyy');
  });

  it('isValidBase64DataUri() valid PNG Data URI', () => {
    const valid = UploadFileHelper
      .isValidBase64DataUri('data:image/jpeg;base64,iVBORw0KGgoAAAANS');
    expect(valid).to.equal(true);
  });
  it('isValidBase64DataUri() invalid PNG Data URI - 1', () => {
    const valid = UploadFileHelper
      .isValidBase64DataUri('data:image/jpeg;base64,iVBOöäüßRw0KGgoAAAANS');
    expect(valid).to.equal(false);
  });
  it('isValidBase64DataUri() invalid PNG Data URI - 2', () => {
    const valid = UploadFileHelper
      .isValidBase64DataUri('data:image/jpegse64,iVBOöäüßRw0KGgoAAAANS');
    expect(valid).to.equal(false);
  });
  it('isValidBase64DataUri() invalid PNG Data URI - 4', () => {
    const valid = UploadFileHelper
      .isValidBase64DataUri('');
    expect(valid).to.equal(false);
  });

  it('isValidTemporaryFileName() valid temporary filename', () => {
    const valid = UploadFileHelper
      .isValidTemporaryFileName('kjhguffi678o7ghu.png');
    expect(valid).to.equal(true);
  });
  it('isValidTemporaryFileName() invalid temporary filename', () => {
    const valid = UploadFileHelper
      .isValidTemporaryFileName('kjhguffi678äöüß098 o7ghu.png');
    expect(valid).to.equal(false);
  });
});
