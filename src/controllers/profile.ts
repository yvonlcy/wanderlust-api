import { Context } from 'koa'

// Returns the authenticated user's profile (id, role, username, email)
import { getDb } from '../services/db'
import { ObjectId } from 'mongodb'

export const getProfile = async (ctx: Context) => {
  // ctx.state.user is set by auth middleware
  const user = ctx.state.user
  const db = await getDb();
  // Fetch username and email from DB
  const dbUser = await db.collection('users').findOne({ _id: typeof user.id === 'string' ? new ObjectId(user.id) : user.id });
  ctx.body = {
    id: user.id,
    role: user.role,
    username: dbUser?.username,
    email: dbUser?.email,
  }
}
