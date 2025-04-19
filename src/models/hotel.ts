import { ObjectId } from 'mongodb'
export interface Hotel {
  _id?: ObjectId | string
  name: string
  star: number
  address: string
  city: string
  country: string
  description?: string
  price?: number
  facilities?: string[]
  lastUpdate?: string
}