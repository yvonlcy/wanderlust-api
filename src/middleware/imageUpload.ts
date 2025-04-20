import multer from '@koa/multer';
import path from 'path';

// 5MB size limit
const MAX_SIZE = 5 * 1024 * 1024;

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (req: any, file: any, cb: any) => {
      // Use original name or you can generate unique names
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});
