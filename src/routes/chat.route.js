import { Router } from 'express'
import { requireAdminLoggedIn, requireLoggedIn } from '../middlewares/auth'
import { chatController } from '../controllers'
import validate from '../middlewares/validate'
import { chatValidation } from '../validations'
import upload, { uploadChatImage } from '../middlewares/upload'
import uploadStorage from '../middlewares/uploadStorage'

const router = new Router()
router
  .route('/')
  .get(
    requireLoggedIn,
    validate(chatValidation.getChats),
    chatController.getChats
  )
  .post(
    requireLoggedIn,
    validate(chatValidation.createChat),
    chatController.createChat
  )

router.patch(
  '/:chatId/markAsRead',
  requireLoggedIn,
  validate(chatValidation.updateChat),
  chatController.markAdReadMessage
)
router
  .route('/:chatId')
  .get(
    requireLoggedIn,
    validate(chatValidation.getChat),
    chatController.getChat
  )
  .delete(
    requireLoggedIn,
    validate(chatValidation.deleteChat),
    chatController.deleteChat
  )
  .patch(
    requireLoggedIn,
    validate(chatValidation.updateChat),
    chatController.updateChat
  )

export default router
