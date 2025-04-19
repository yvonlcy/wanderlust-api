import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'

interface JwtPayload {
  id: string
  role: 'operator' | 'member'
}

export const auth = (roles: Array<'operator' | 'member'> = []) =>
  async (ctx: Context, next: Next) => {
    const header = ctx.headers.authorization
    if (!header?.startsWith('Bearer ')) ctx.throw(401, 'No token')

    try {
      const token = header.split('Bearer ')[1]
      const payload = jwt.verify(token, JWT_SECRET as string) as JwtPayload
      if (roles.length && !roles.includes(payload.role)) ctx.throw(403, 'Forbidden')
      ctx.state.user = payload
      await next()
    } catch {
      ctx.throw(401, 'Invalid / expired token')
    }
  }

        
    



