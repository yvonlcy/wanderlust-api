import { Context, Next } from 'koa'

/**
 * Error handling middleware.
 * Catches and handles errors thrown by downstream middleware.
 * Emits an 'error' event on the Koa app instance for logging purposes.
 */
type MongoDuplicateKeyError = {
  code: number;
  keyValue?: Record<string, unknown>;
};

function isMongoDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as Partial<MongoDuplicateKeyError>).code === 11000
  );
}

export default async function errorMiddleware(ctx: Context & { next: Next }, next: Next) {
  try {
    await next()
  } catch (err: unknown) {
    // Type guard for Error object
    if (err instanceof Error) {
      if (isMongoDuplicateKeyError(err)) {
        ctx.status = 409;
        ctx.body = {
          message: 'Duplicate key error',
          code: 11000,
          keyValue: (err as { keyValue?: Record<string, unknown> }).keyValue,
        };
      } else {
        type StatusError = Error & { status?: number };
        function hasStatus(error: Error): error is StatusError {
          return typeof (error as StatusError).status === 'number';
        }
        ctx.status = hasStatus(err) && typeof err.status === 'number' ? err.status : 500;
        ctx.body = { message: err.message };
      }
    } else {
      ctx.status = 500
      ctx.body = { message: 'Unknown error' }
    }
    ctx.app.emit('error', err, ctx) // Optional: for logging
  }
}
