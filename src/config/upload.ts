import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    disk: {};
    s3: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(20).toString('hex');
        const fileName = `${fileHash}-${new Date().getTime()}.${file.originalname
          .split('.')
          .pop()}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    s3: {
      bucket: 'app-gobarber',
    },
  },
} as IUploadConfig;
