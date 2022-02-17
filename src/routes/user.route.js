import { Router } from 'express'
const router = new Router()
import { protect, requireLoggedIn } from '../middlewares/auth'
import { userController } from '../controllers'
import { userValidation } from '../validations'
import validate from '../middlewares/validate'

router.get('/sort', requireLoggedIn, userController.getTopFollowers)

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers)

router.get('/me', protect, userController.getMe)
router.patch('/update-me', protect, userController.updateMe)

router.patch(
  '/reset_password/:userId',
  validate(userValidation.updateUser),
  userController.updateUserPassword
)

router.patch('/active_account/:userId', userController.verifyAccount)
router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.get(
  '/:userId/followers',
  requireLoggedIn,
  userController.getUserFollowers
)

router.get(
  '/:userId/following',
  requireLoggedIn,
  userController.getUserFollowing
)

router.patch('/:userId/follow', requireLoggedIn, userController.follow)

export default router
