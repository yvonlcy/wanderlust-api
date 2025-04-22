import multer from '@koa/multer'
import path from 'path'

// 5MB size limit
const MAX_SIZE = 5 * 1024 * 1024

export const imageUpload = multer({
  storage: multer.diskStorage({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destination(req: any, file: any, cb: any) {
      cb(null, path.join(process.cwd(), 'uploads'))
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename(req: any, file: any, cb: any) {
      // Type assertion for file
      const safeFile = file as { originalname: string }
      cb(null, Date.now() + '-' + safeFile.originalname)
    },
  }),
  limits: { fileSize: MAX_SIZE },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileFilter(req: any, file: any, cb: any) {
    // Type assertion for file
    const safeFile = file as { mimetype: string }
    if (safeFile.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})
