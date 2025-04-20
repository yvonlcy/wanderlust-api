import { getDb } from '../services/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { ObjectId } from 'mongodb';
import { User } from '../models/user';
import bcrypt from 'bcrypt';


import { z } from 'zod';

const operatorRegisterSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email'),
  agency: z.string().min(1, 'Agency is required'),
});

export async function registerOperator(ctx: any) {
  const parseResult = operatorRegisterSchema.safeParse(ctx.request.body);
  if (!parseResult.success) {
    ctx.throw(400, JSON.stringify(parseResult.error.flatten()));
    return;
  }
  // TypeScript now knows parseResult.data is defined
  const { username, password, email, agency } = parseResult.data;
  const db = await getDb();
  const exists = await db.collection('users').findOne({ username });
  if (exists) ctx.throw(409, 'Username already exists');
  const hash = await bcrypt.hash(password, 10);
  const user: User = { username, password: hash, email, role: 'operator', favorites: [], agency };
  const result = await db.collection('users').insertOne(user);
  ctx.status = 201;
  ctx.body = { id: result.insertedId, message: 'Operator registered' };
}

export async function loginOperator(ctx: any) {
  const { username, password } = ctx.request.body;
  const db = await getDb();
  const user = await db.collection('users').findOne({ username, role: 'operator' });
  if (!user) {
    ctx.throw(401, 'Invalid username or password');
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ctx.throw(401, 'Invalid username or password');
    return;
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' });
  ctx.body = { token, user: { id: user._id, username: user.username, email: user.email } };
}
