import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { register, login } from '../controllers/auth'

const router = new Router({ prefix: '/auth' })

router.post('/register', bodyParser(), register)
router.post('/login', bodyParser(), login)

export default router



