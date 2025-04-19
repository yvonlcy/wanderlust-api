import Router from 'koa-router'
import { listHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotel'
import { auth } from '../middleware/auth'

const router = new Router({ prefix: '/hotels' })

// public routes
router.get('/', listHotels)
router.get('/:id', getHotel)

// operator routes
router.post('/', auth(['operator']), createHotel)
router.put('/:id', auth(['operator']), updateHotel)
router.delete('/:id', auth(['operator']), deleteHotel)

export default router
