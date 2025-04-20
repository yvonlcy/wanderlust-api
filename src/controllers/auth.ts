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

type UserRole = 'member' | 'operator';

export const register = async (ctx: Context) => {
  console.log('DEBUG register input:', ctx.request.body);
  try {
    console.log('DEBUG register: entered try block');
  const { username, password, email, role, signUpCode } = ctx.request.body as RegisterRequestBody;

  // Validate signUpCode for operator
  if (role === 'operator' && signUpCode !== SIGNUP_CODE) {
    console.log('DEBUG register: invalid sign-up code');
    ctx.throw(403, 'Invalid sign-up code');
  }

  const db = await getDb();
  console.log('DEBUG register: got db');
  const exists = await db.collection('users').findOne({ username });
  console.log('DEBUG register: checked existing user', exists);
  if (exists) {
    console.log('DEBUG register: username taken');
    ctx.throw(409, 'Username taken');
  }

  const hash = await bcrypt.hash(password, 10);
  console.log('DEBUG register: hashed password');

  // Only allow 'member' or 'operator' as role, default to 'member'
  const allowedRoles: UserRole[] = ['member', 'operator'];
  const userRole: UserRole = allowedRoles.includes(role) ? role : 'member';
  console.log('DEBUG register: userRole', userRole);

  const result = await db.collection('users').insertOne({
    username,
    password: hash,
    email,
    role: userRole,
  });
  console.log('DEBUG register: inserted user', result.insertedId);

  ctx.status = 201;
  ctx.body = { id: result.insertedId };
  console.log('DEBUG register success:', result.insertedId);
  } catch (err) {
    console.log('DEBUG register error:', err);
    throw err;
  }
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

    