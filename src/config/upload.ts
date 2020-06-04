import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(5).toString('hex');
      const fileName = `${fileHash}-${new Date().getTime()}.${
        file.originalname
      }`;

      return callback(null, fileName);
    },
  }),
};
