import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config/env';
import { Context } from 'koa';

export async function refreshOperatorToken(ctx: Context) {
  const { refresh } = ctx.request.body as { refresh: string };
  if (!refresh) {
    ctx.status = 400;
    ctx.body = { message: 'Refresh token required' };
    return;
  }
  try {
    const payload = jwt.verify(refresh, JWT_REFRESH_SECRET as string) as { id: string, role?: string, type: string };
    if (payload.type !== 'refresh') {
      ctx.status = 400;
      ctx.body = { message: 'Invalid token type' };
      return;
    }
    // Issue a new access token
    const access = jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET as string, { expiresIn: '7d' });
    ctx.status = 200;
    ctx.body = { access };
  } catch {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired refresh token' };
  }
}
