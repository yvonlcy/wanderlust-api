import { Context } from 'koa'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_REFRESH_SECRET, SIGNUP_CODE } from '../config/env'
import { getDb } from '../services/db'

// helpers
const signTokens = (payload: object) => {
    const access = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '15m' })
    const refresh = jwt.sign(payload, JWT_REFRESH_SECRET as string, { expiresIn: '7d' })
    return { access, refresh }
}

// routes handler
interface RegisterRequestBody {
  username: string
  password: string
  email: string
  role: 'operator' | 'member'
  signUpCode?: string
}

export const register = async (ctx: Context) => {
  const { username, password, email, role, signUpCode } = ctx.request.body as RegisterRequestBody

  if (role === 'operator' && signUpCode !== SIGNUP_CODE) {
    ctx.throw(403, 'Invalid sign-up code')
  }

  const db = await getDb()
  const exists = await db.collection('users').findOne({ username })
  if (exists) ctx.throw(409, 'Username taken')

  const hash = await bcrypt.hash(password, 10)

  // if no role is provided, default to 'member'
  const userRole = role ?? 'member'

  const result = await db.collection('users').insertOne({
    username,
    password: hash,
    email,
    role: userRole,
  })

  ctx.status = 201
  ctx.body = { id: result.insertedId }
}

interface LoginRequestBody {
  username: string
  password: string
}

export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body as LoginRequestBody

  const db = await getDb()
  const user = await db.collection('users').findOne({ username })
  if (!user) ctx.throw(401, 'Invalid credentials')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) ctx.throw(401, 'Invalid credentials')

  const tokens = signTokens({ id: user._id, role: user.role })
  ctx.body = { tokens }
}

    