import { Router } from 'express'
import { requireLoggedIn } from '../middlewares/auth'
import { profileController } from '../controllers'
const router = new Router()

router.get(
  '/:username/followers',
  requireLoggedIn,
  profileController.getFollowers
)

router.get(
  '/:username/following',
  requireLoggedIn,
  profileController.getFollowing
)

router.get('/:username/replies', requireLoggedIn, profileController.getReplies)

router.get(
  '/:username',
  requireLoggedIn,
  profileController.getProfileByUsername
)

router.get('/', requireLoggedIn, profileController.getProfile)

export default router
