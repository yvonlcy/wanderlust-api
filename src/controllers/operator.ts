import { getDb } from '../services/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'
import { ObjectId } from 'mongodb'
import { User } from '../models/user'

export async function registerOperator(ctx: any) {
  const { username, password, email, agency } = ctx.request.body
  if (!username || !password || !email || !agency) {
    ctx.throw(400, 'Missing required fields')
  }
  const db = await getDb()
  const exists = await db.collection<User>('users').findOne({ username })
  if (exists) ctx.throw(409, 'Username already exists')
  const user: User = { username, password, email, role: 'operator', favorites: [], agency }
  const result = await db.collection<User>('users').insertOne(user)
  ctx.status = 201
  ctx.body = { id: result.insertedId, message: 'Operator registered' }
}
export async function loginOperator(ctx: any) {
  const { username, password } = ctx.request.body
  const db = await getDb()
  const user = await db.collection<User>('users').findOne({ username, password, role: 'operator' })
  if (!user) {
    ctx.throw(401, 'Invalid username or password')
    return
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' })
  ctx.body = { token, user: { id: user._id, username: user.username, email: user.email } }
}
