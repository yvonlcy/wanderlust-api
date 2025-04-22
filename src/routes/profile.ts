import Router from 'koa-router'
import { getProfile } from '../controllers/profile'
import { auth } from '../middleware/auth'

const router = new Router({ prefix: '/profile' })

// GET /api/profile
router.get('/', auth(), getProfile)

export default router
