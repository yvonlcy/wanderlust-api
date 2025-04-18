import Router from 'koa-router'

const router = new Router()

// GET /health
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' }
})

export default router
