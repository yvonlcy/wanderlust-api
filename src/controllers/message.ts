import { getDb } from '../services/db'
import { ObjectId } from 'mongodb'
import { Message, Reply } from '../models/message'

export async function sendMessage(ctx: any) {
  const { fromId, toId, content } = ctx.request.body;
  if (!fromId || !toId || !content) ctx.throw(400, 'Missing fields');
  const db = await getDb();
  const message = {
    fromUserId: new ObjectId(fromId),
    toUserId: new ObjectId(toId),
    content,
    createdAt: new Date(),
    replies: []
  };
  const result = await db.collection('messages').insertOne(message);
  ctx.status = 201;
  ctx.body = { id: result.insertedId, message: 'Message sent' };
}
export async function replyMessage(ctx: any) {
  const messageId = ctx.params.id;
  const { fromId, content } = ctx.request.body;
  if (!fromId || !content) ctx.throw(400, 'Missing fields');
  const db = await getDb();
  const reply: Reply = { fromUserId: fromId, content, createdAt: new Date() };
  const result = await db.collection('messages').updateOne(
    { _id: new ObjectId(messageId) },
    { $push: { replies: { $each: [reply] } } } as any
  );
  if (result.modifiedCount === 0) ctx.throw(404, 'Message not found');
  ctx.body = { message: 'Reply sent' };
}
export async function listMessages(ctx: any) {
  const { userId } = ctx.query;
  if (!userId) ctx.throw(400, 'Missing userId');
  const db = await getDb();
  const messages = await db.collection('messages').aggregate([
    {
      $match: {
        $or: [
          { fromUserId: new ObjectId(userId) },
          { toUserId: new ObjectId(userId) }
        ]
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'fromUserId',
        foreignField: '_id',
        as: 'fromUser'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'toUserId',
        foreignField: '_id',
        as: 'toUser'
      }
    },
    { $unwind: '$fromUser' },
    { $unwind: '$toUser' },
    // Optional: limit returned user fields
    {
      $project: {
        content: 1,
        createdAt: 1,
        replies: 1,
        fromUserId: 1,
        toUserId: 1,
        'fromUser._id': 1,
        'fromUser.username': 1,
        'fromUser.email': 1,
        'toUser._id': 1,
        'toUser.username': 1,
        'toUser.email': 1
      }
    }
  ]).toArray();
  ctx.body = { messages };
}
export async function deleteMessage(ctx: any) {
  const messageId = ctx.params.id
  const db = await getDb()
  const result = await db.collection('messages').deleteOne({ _id: new ObjectId(messageId) })
  if (result.deletedCount === 0) ctx.throw(404, 'Message not found')
  ctx.body = { message: 'Message deleted' }
}
