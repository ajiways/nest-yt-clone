import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const videoStorage = diskStorage({
  destination: 'files/videos',
  filename: (req, file, cb) => {
    const newVideoName = v4();
    cb(null, newVideoName);
  },
});

export const videoOptions = {
  limits: {
    fileSize: 1e9,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error, acceptFile: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(mp4|mkv)$/)) {
      return cb(null, false);
    } else {
      return cb(null, true);
    }
  },
};

export const previewStorage = diskStorage({
  destination: 'files/previews',
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error, filename: string) => void,
  ) => {
    try {
      cb(null, `${req.headers.videoid.toString()}.jpg`);
    } catch (error) {
      console.log(error);
    }
  },
});

export const previewOptions = {
  limits: {
    fileSize: 200000,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error, acceptFile: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(null, false);
    } else {
      return cb(null, true);
    }
  },
};
