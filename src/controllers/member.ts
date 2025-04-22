import { getDb } from '../services/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'
import { ObjectId } from 'mongodb'
import { User } from '../models/user'

import bcrypt from 'bcrypt'
import { Context } from 'koa'
import path from 'path'

interface MemberRegisterBody {
  username: string
  password: string
  email: string
}

export async function registerMember(ctx: Context) {
  const { username, password, email } = ctx.request.body as MemberRegisterBody
  if (!username || !password || !email) {
    ctx.status = 400
    ctx.response.status = ctx.status;
    ctx.body = { message: 'Missing required fields' }
    return
  }
  const db = await getDb()
  const exists = await db.collection('users').findOne({ username })
  if (exists) {
    ctx.status = 409
    ctx.response.status = ctx.status;
    ctx.body = { message: 'Username already exists' }
    return
  }
  const hash = await bcrypt.hash(password, 10)
  // MongoDB expects _id?: ObjectId, not string
  const user: Omit<User, '_id'> = { username, password: hash, email, role: 'member' }
  const result = await db.collection('users').insertOne(user)
  ctx.status = 201
  ctx.response.status = ctx.status;
  ctx.body = { id: result.insertedId, message: 'Member registered' }
  return;
}

interface MemberLoginBody {
  username: string
  password: string
}

export async function loginMember(ctx: Context) {
  const { username, password } = ctx.request.body as MemberLoginBody
  const db = await getDb()
  const user = await db.collection('users').findOne({ username, role: 'member' })
  if (!user) {
    ctx.status = 401
    ctx.body = { message: 'Invalid username or password' }
    return
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    ctx.status = 401
    ctx.body = { message: 'Invalid username or password' }
    return
  }
  // Generate both access and refresh tokens for test compatibility
  const access = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' })
  const refresh = jwt.sign({ id: user._id, type: 'refresh' }, JWT_SECRET as string, { expiresIn: '30d' })
  ctx.status = 200;
  ctx.response.status = ctx.status;
  ctx.body = {
    tokens: { access, refresh },
    user: { id: user._id, username: user.username, email: user.email }
  }
  return;
}

export async function uploadPhoto(ctx: Context) {
  // multer adds file to ctx.request.file
  const file = ctx.request.file as {
    filename: string
    path: string
    mimetype: string
    size: number
  }
  if (!file) {
    ctx.throw(400, 'No file uploaded')
  }
  ctx.body = {
    message: 'Image uploaded successfully',
    filename: file.filename,
    path: path.relative(process.cwd(), file.path),
    mimetype: file.mimetype,
    size: file.size,
  }
}
interface AddFavouriteBody {
  hotelId: string
}

export async function addFavourite(ctx: Context) {
  const memberId = ctx.params.id as string
  const { hotelId } = ctx.request.body as AddFavouriteBody
  if (!hotelId) ctx.throw(400, 'Missing hotelId')
  const db = await getDb()
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { $addToSet: { favorites: hotelId } } as any,
  )
  if (result.modifiedCount === 0) ctx.throw(404, 'Member not found')
  ctx.body = { message: 'Added to favourites' }
}
export async function listFavourites(ctx: Context) {
  const memberId = ctx.params.id as string
  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: new ObjectId(memberId), role: 'member' })
  if (!user) {
    ctx.throw(404, 'Member not found')
    return
  }
  ctx.body = { favorites: user.favorites || [] }
}
export async function removeFavourite(ctx: Context) {
  const memberId = ctx.params.id as string
  const hotelId = ctx.params.hotelId as string
  const db = await getDb()
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { $pull: { favorites: { $eq: hotelId } } } as any,
  )
  if (result.modifiedCount === 0) ctx.throw(404, 'Member not found or favourite not found')
  ctx.body = { message: 'Removed from favourites' }
}
