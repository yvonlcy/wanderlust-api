import 'koa'

declare module 'koa' {
  interface Request {
    file?: unknown
    files?: unknown
  }
}
