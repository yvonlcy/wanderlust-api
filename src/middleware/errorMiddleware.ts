import { Context, Next } from 'koa'

/**
 * Error handling middleware.
 * Catches and handles errors thrown by downstream middleware.
 * Emits an 'error' event on the Koa app instance for logging purposes.
 */
export default async function errorMiddleware(ctx: Context & { next: Next }, next: Next) {
  try {
    await next()
  } catch (err: unknown) {
    // Type guard for Error object
    if (err instanceof Error) {
      // If custom error with status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx.status = typeof (err as any).status === 'number' ? (err as any).status : 500
      ctx.body = { message: err.message }
    } else {
      ctx.status = 500
      ctx.body = { message: 'Unknown error' }
    }
    ctx.app.emit('error', err, ctx) // Optional: for logging
  }
}
