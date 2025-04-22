declare module '@koa/multer' {
  import { Middleware } from 'koa'

  namespace multer {
    interface Multer {
      single(fieldname: string): Middleware
      array(fieldname: string, maxCount?: number): Middleware
      // ... add more as needed
    }
    type StorageEngine = object
    interface Options {
      storage?: StorageEngine
      limits?: unknown
      fileFilter?: unknown
    }
  }
  function multer(options?: multer.Options): multer.Multer
  namespace multer {
    function diskStorage(options: {
      destination?: string | ((req: unknown, file: unknown, cb: unknown) => void)
      filename?: (req: unknown, file: unknown, cb: unknown) => void
    }): StorageEngine
    // ... add more as needed
  }
  export = multer
}
