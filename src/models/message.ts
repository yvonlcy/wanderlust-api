import { ObjectId } from 'mongodb';

export interface Reply {
  fromUserId: string;
  content: string;
  createdAt: Date | string;
}

export interface Message {
  _id?: string | ObjectId;
  fromUserId: ObjectId;
  toUserId: ObjectId;
  content: string;
  createdAt?: string;
  replyToId?: string;
  replies?: Reply[];
}

