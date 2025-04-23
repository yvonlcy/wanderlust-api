import Router from 'koa-router'
import {
  registerMember,
  loginMember,
  uploadPhoto,
  addFavourite,
  listFavourites,
  removeFavourite,
  refreshToken,
} from '../controllers/member'
import { imageUpload } from '../middleware/imageUpload'

const router = new Router({ prefix: '/members' })

router.post('/register', registerMember)
router.post('/login', loginMember)
router.post('/refresh-token', refreshToken)
router.post('/:id/photo', imageUpload.single('photo'), uploadPhoto)
router.post('/:id/favourites', addFavourite)
router.get('/:id/favourites', listFavourites)
router.delete('/:id/favourites/:hotelId', removeFavourite)

export default router
