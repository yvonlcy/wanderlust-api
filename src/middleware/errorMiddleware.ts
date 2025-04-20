import { Context, Next } from 'koa';

export async function errorMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      status: ctx.status,
      message: err.message || 'Internal Server Error',
    };
    ctx.app.emit('error', err, ctx); // Optional: for logging
  }
}
