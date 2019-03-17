import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import promisesAll from 'promises-all';
import { internalServerError } from '../../utils/errors';
import util from '../../utils/util';
import { throwError } from '../../utils/logger';

const uploadCtr = {
  singleFileUpload: async (type = 'user', file, req) => {
    try {
      const rootDir = './';
      const staticDir = 'uploads/';
      let uploadDir;
      const id = req.session.user.id;
      const idEncrypted = util.encrypt(id.toString());

      switch (type) {
        case 'user':
          uploadDir = `users/${idEncrypted}`;
          break;
        case 'book':
          uploadDir = `books/${idEncrypted}`;
          break;
        case 'blog':
          uploadDir = `blogs/${idEncrypted}`;
          break;
        case 'banner':
          uploadDir = `banners/${idEncrypted}`;
          break;
        default:
          uploadDir = `users/${idEncrypted}`;
          break;
      }

      mkdirp.sync(rootDir + staticDir + uploadDir);

      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const fileNameOnly = path.parse(filename).name;
      const fileNameExt = path.parse(filename).ext;
      const uploadPathWithoutStatic = `${uploadDir}/${fileNameOnly}-${Date.now()}${fileNameExt}`;
      const uploadPath = `${staticDir}${uploadPathWithoutStatic}`;

      return new Promise((resolve, reject) =>
        stream
          .on('error', error => {
            stream.truncated && fs.unlinkSync(uploadPath);
            reject(error);
          })
          .pipe(fs.createWriteStream(uploadPath))
          .on('error', error => reject(error))
          .on('finish', () => resolve({ path: uploadPathWithoutStatic }))
      );
    } catch (err) {
      throwError(new internalServerError());
    }
  },
  async multipleFileUpload(type = 'user', { files }, req) {
    const { resolve, reject } = await promisesAll.all(
      files.map(file => uploadCtr.singleFileUpload(file, req))
    );

    if (reject.length)
      reject.forEach(({ name, message }) =>
        // eslint-disable-next-line no-console
        console.error(`${name}: ${message}`)
      );

    return resolve;
  }
};

export { uploadCtr };
