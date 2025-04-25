import { getDb } from '../services/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config/env'
import { ObjectId } from 'mongodb'
import { User } from '../models/user'

import bcrypt from 'bcrypt'
import { Context } from 'koa'
import path from 'path'
import { z } from 'zod'

const memberRegisterSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email'),
})

export async function registerMember(ctx: Context) {
  const parseResult = memberRegisterSchema.safeParse(ctx.request.body)
  if (!parseResult.success) {
    ctx.status = 400
    ctx.response.status = ctx.status;
    ctx.body = { message: 'Validation failed', errors: parseResult.error.flatten() }
    return
  }
  const { username, password, email } = parseResult.data
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


const memberLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export async function loginMember(ctx: Context) {
  const parseResult = memberLoginSchema.safeParse(ctx.request.body)
  if (!parseResult.success) {
    ctx.status = 400
    ctx.body = { message: 'Validation failed', errors: parseResult.error.flatten() }
    return
  }
  const { username, password } = parseResult.data
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

export async function refreshToken(ctx: Context) {
  const { refresh } = ctx.request.body as { refresh: string }
  if (!refresh) {
    ctx.status = 400
    ctx.body = { message: 'Refresh token required' }
    return
  }
  try {
    const payload = jwt.verify(refresh, JWT_REFRESH_SECRET as string) as { id: string, role?: string, type: string }
    if (payload.type !== 'refresh') {
      ctx.status = 400
      ctx.body = { message: 'Invalid token type' }
      return
    }
    // Issue a new access token
    const access = jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET as string, { expiresIn: '7d' })
    ctx.status = 200
    ctx.body = { access }
  } catch {
    ctx.status = 401
    ctx.body = { message: 'Invalid or expired refresh token' }
  }
}

export async function uploadPhoto(ctx: Context) {
  // Ensure only the member can upload their own photo
  if (!ctx.state.user || ctx.state.user.role !== 'member' || ctx.state.user.id !== ctx.params.id) {
    ctx.throw(403, 'Forbidden: You can only upload your own photo')
    return
  }
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

export async function addFavourite(ctx: Context) {
  const memberId = ctx.params.id as string
  const hotelId = ctx.params.hotelId as string; // Read hotelId from path params

  // Validate input
  if (!hotelId) {
    ctx.throw(400, 'Missing hotelId in path');
  }
  if (!ObjectId.isValid(memberId)) {
    ctx.throw(400, 'Invalid member ID format');
  }
  // Note: hotelId is stored as string, no ObjectId validation needed here

  const db = await getDb()
  const result = await db.collection<User>('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    { $addToSet: { favorites: hotelId } } // $addToSet handles duplicates
  );

  // Check if the member document was found
  if (result.matchedCount === 0) {
    ctx.throw(404, 'Member not found'); // Member truly doesn't exist
  }

  // If member was found (matchedCount > 0), the operation is successful
  // $addToSet ensures the hotelId is in the favorites array.
  // Return 200 OK regardless of modifiedCount for idempotency.
  ctx.body = { message: 'Hotel added to favourites' };
}

export async function listFavourites(ctx: Context) {
  const memberId = ctx.params.id as string
  if (!ObjectId.isValid(memberId)) {
     ctx.throw(400, 'Invalid member ID format');
  }

  const db = await getDb();
  const member = await db.collection<User>('users').findOne(
    { _id: new ObjectId(memberId), role: 'member' },
    { projection: { favorites: 1 } } // Only fetch favorites
  );

  if (!member) {
    ctx.throw(404, 'Member not found');
  }

  ctx.body = { favorites: member.favorites || [] }; // Return empty array if no favorites
}

export async function removeFavourite(ctx: Context) {
  const memberId = ctx.params.id as string;
  const hotelId = ctx.params.hotelId as string;

  if (!hotelId) {
    ctx.throw(400, 'Missing hotelId in path');
  }
  if (!ObjectId.isValid(memberId)) {
    ctx.throw(400, 'Invalid member ID format');
  }

  const db = await getDb();
  const result = await db.collection<User>('users').updateOne(
    { _id: new ObjectId(memberId), role: 'member' },
    { $pull: { favorites: hotelId } } // Use $pull to remove
  );

  // Check if the member was found
  if (result.matchedCount === 0) {
    ctx.throw(404, 'Member not found');
  }

  // Check if the hotel was actually removed (optional, depends on desired behavior)
  // if (result.modifiedCount === 0) {
  //   ctx.throw(404, 'Favourite hotel not found for this member');
  // }

  // Return 200 or 204. 200 indicates success, even if item wasn't present.
  ctx.body = { message: 'Hotel removed from favourites' };
  // Or ctx.status = 204; // No content
}
