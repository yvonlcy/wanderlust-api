import Router from 'koa-router'
import { sendMessage, replyMessage, listMessages, deleteMessage } from '../controllers/message'
import { auth } from '../middleware/auth'

const router = new Router({ prefix: '/messages' })

router.post('/', auth(), sendMessage)
router.post('/:id/reply', auth(), replyMessage)
router.get('/', auth(), listMessages)
router.delete('/:id', auth(), deleteMessage)

export default router
