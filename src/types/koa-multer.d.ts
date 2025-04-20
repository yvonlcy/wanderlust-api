declare module '@koa/multer' {
  import { Middleware } from 'koa';
  namespace multer {
    interface Multer {
      single(fieldname: string): Middleware;
      array(fieldname: string, maxCount?: number): Middleware;
      // ... add more as needed
    }
    interface StorageEngine {}
    interface Options {
      storage?: StorageEngine;
      limits?: any;
      fileFilter?: any;
    }
  }
  function multer(options?: multer.Options): multer.Multer;
  namespace multer {
    function diskStorage(options: {
      destination?: string | ((req: any, file: any, cb: any) => void);
      filename?: (req: any, file: any, cb: any) => void;
    }): StorageEngine;
    // ... add more as needed
  }
  export = multer;
}
