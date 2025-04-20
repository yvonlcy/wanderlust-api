import Router from 'koa-router'
import { registerOperator, loginOperator } from '../controllers/operator'

const router = new Router({ prefix: '/operators' })

router.post('/register', registerOperator)
router.post('/login', loginOperator)

export default router
