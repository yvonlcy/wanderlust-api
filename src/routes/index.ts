import Router from 'koa-router'
import health from './health'
import hotel from './hotel'
import operator from './operator'
import member from './member'
import message from './message'
import auth from './auth'

const router = new Router({ prefix: '/api' })

router.use(health.routes())
router.use(hotel.routes())
router.use(operator.routes())
router.use(member.routes())
router.use(message.routes())
router.use(auth.routes())

export default router
