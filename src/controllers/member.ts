import { getDb } from '../services/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'
import { ObjectId } from 'mongodb'
import { User } from '../models/user'

export async function registerMember(ctx: any) {
  const { username, password, email } = ctx.request.body
  if (!username || !password || !email) {
    ctx.throw(400, 'Missing required fields')
  }
  const db = await getDb()
  const exists = await db.collection<User>('users').findOne({ username })
  if (exists) ctx.throw(409, 'Username already exists')
  const user: User = { username, password, email, role: 'member' }
  const result = await db.collection<User>('users').insertOne(user)
  ctx.status = 201
  ctx.body = { id: result.insertedId, message: 'Member registered' }
}
export async function loginMember(ctx: any) {
  const { username, password } = ctx.request.body
  const db = await getDb()
  const user = await db.collection<User>('users').findOne({ username, password, role: 'member' })
  if (!user) {
    ctx.throw(401, 'Invalid username or password')
    return
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' })
  ctx.body = { token, user: { id: user._id, username: user.username, email: user.email } }
}
export async function uploadPhoto(ctx: any) {
  ctx.body = { message: 'Upload photo - on going' }
}
export async function addFavourite(ctx: any) {
  const memberId = ctx.params.id
  const { hotelId } = ctx.request.body
  if (!hotelId) ctx.throw(400, 'Missing hotelId')
  const db = await getDb()
  const result = await db.collection<User>('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    { $addToSet: { favorites: hotelId } }
  )
  if (result.modifiedCount === 0) ctx.throw(404, 'Member not found')
  ctx.body = { message: 'Added to favourites' }
}
export async function listFavourites(ctx: any) {
  const memberId = ctx.params.id
  const db = await getDb()
  const user = await db.collection<User>('users').findOne({ _id: new ObjectId(memberId), role: 'member' })
  if (!user) {
    ctx.throw(404, 'Member not found')
    return
  }
  ctx.body = { favorites: user.favorites || [] }
}
export async function removeFavourite(ctx: any) {
  const memberId = ctx.params.id
  const hotelId = ctx.params.hotelId
  const db = await getDb()
  const result = await db.collection<User>('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    { $pull: { favorites: hotelId } }
  )
  if (result.modifiedCount === 0) ctx.throw(404, 'Member not found or favourite not found')
  ctx.body = { message: 'Removed from favourites' }
}
