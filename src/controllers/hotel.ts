import { Context } from 'koa'
import { getDb } from '../services/db'
import { Hotel } from '../models/hotel'
import { ObjectId } from 'mongodb'

// GET /hotels?city=Hong%20Kong&star=5
export const listHotels = async (ctx: Context) => {
  console.log('DEBUG: GET /hotels called')
  const { city, star } = ctx.query
  const filter: { city?: string; star?: number } = {}
  if (city) filter.city = String(city)
  if (star) filter.star = Number(star)

  const db = await getDb()
  const hotels = await db.collection<Hotel>('hotels').find(filter).toArray()
  ctx.body = hotels
}

// GET /hotels/:id
export const getHotel = async (ctx: Context) => {
  const { id } = ctx.params
  const db = await getDb()
  let hotel = null
  try {
    hotel = await db
      .collection<Hotel>('hotels')
      .findOne({ _id: new ObjectId(id) })
  } catch {
    ctx.throw(400, 'Invalid hotel id')
  }
  if (!hotel) ctx.throw(404, 'Hotel not found')
  if (hotel && hotel._id && typeof hotel._id !== 'string') {
    hotel._id = hotel._id.toString()
  }
  ctx.body = hotel
}

// POST /hotels   (operator only)
export const createHotel = async (ctx: Context) => {
  const data = ctx.request.body as Hotel
  const db = await getDb()
  const result = await db.collection<Hotel>('hotels').insertOne(data)
  ctx.status = 201
  ctx.body = { id: result.insertedId }
}

// PUT /hotels/:id
export const updateHotel = async (ctx: Context) => {
  const { id } = ctx.params
  const db = await getDb()
  await db
    .collection<Hotel>('hotels')
    .updateOne({ _id: new ObjectId(id) }, { $set: ctx.request.body as Partial<Hotel> })
  ctx.body = { msg: 'update' }
}

// DELETE /hotels/:id
export const deleteHotel = async (ctx: Context) => {
  const { id } = ctx.params
  const db = await getDb()
  await db
    .collection<Hotel>('hotels')
    .deleteOne({ _id: new ObjectId(id) })
  ctx.status = 204
}