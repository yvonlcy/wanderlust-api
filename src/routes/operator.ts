import Router from 'koa-router'
import { registerOperator, loginOperator } from '../controllers/operator'
import { refreshOperatorToken } from '../controllers/refreshOperatorToken'

const router = new Router({ prefix: '/operators' })

router.post('/register', registerOperator)
router.post('/login', loginOperator)
router.post('/refresh-token', refreshOperatorToken)

export default router
