import { Router } from 'express'
import { requireLoggedIn } from '../middlewares/auth'
import { postController } from '../controllers'
import validate from '../middlewares/validate'
import { postValidation } from '../validations'
import { uploadPostImage } from '../middlewares/upload'
import uploadStorage from '../middlewares/uploadStorage'

const router = new Router()
router
  .route('/')
  .get(
    requireLoggedIn,
    validate(postValidation.getPosts),
    postController.getPosts
  )
  .post(
    requireLoggedIn,
    uploadStorage.single('postImage'),
    validate(postValidation.createPost),
    uploadPostImage,
    postController.createPost
  )

router.get('/sort', requireLoggedIn, postController.getTopPosts)

router
  .route('/:postId')
  .get(
    requireLoggedIn,
    validate(postValidation.getPost),
    postController.getPost
  )
  .delete(
    requireLoggedIn,
    validate(postValidation.deletePost),
    postController.deletePost
  )
  .patch(
    requireLoggedIn,
    validate(postValidation.updatePost),
    postController.updatePost
  )

router.patch(
  '/:postId/like',
  requireLoggedIn,
  validate(postValidation.updatePost),
  postController.likePost
)

router.post(
  '/:postId/retweet',
  requireLoggedIn,
  validate(postValidation.updatePost),
  postController.retweetPost
)

export default router
