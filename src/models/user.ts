import { ObjectId } from 'mongodb'

export interface User {
  _id?: string | ObjectId
  username: string
  password: string
  role: 'operator' | 'member'
  email: string
  favorites?: string[]
  agency?: string // for operator only
}
