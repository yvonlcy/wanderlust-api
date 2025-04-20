export interface Reply {
  fromUserId: string
  content: string
  createdAt: Date | string
}

import { ObjectId } from 'mongodb'

export interface Reply {
  fromUserId: string
  content: string
  createdAt: Date | string
}

export interface Message {
  _id?: string | ObjectId
  fromUserId: string
  toUserId: string
  content: string
  createdAt?: string
  replyToId?: string
  replies?: Reply[]
}

