import Router from 'koa-router'
import { sendMessage, replyMessage, listMessages, deleteMessage } from '../controllers/message'

const router = new Router({ prefix: '/messages' })

router.post('/', sendMessage)
router.post('/:id/reply', replyMessage)
router.get('/', listMessages)
router.delete('/:id', deleteMessage)

export default router
