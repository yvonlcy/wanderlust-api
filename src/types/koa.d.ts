import 'koa';

declare module 'koa' {
  interface Request {
    file?: any;
    files?: any;
  }
}
