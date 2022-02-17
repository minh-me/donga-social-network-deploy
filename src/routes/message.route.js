import { Router } from 'express'
import { messageController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'
import validate from '../middlewares/validate'
import { chatValidation, messageValidation } from '../validations'

import { uploadMessageImage } from '../middlewares/upload'
import uploadStorage from '../middlewares/uploadStorage'

const router = new Router()

router.get('/new', requireLoggedIn, messageController.getCreateNewChatPage)
router.get(
  '/content',
  requireLoggedIn,
  validate(messageValidation.getMessages),
  messageController.getMessages
)

router.get(
  '/:chatId',
  requireLoggedIn,
  validate(chatValidation.getChat),
  messageController.getChatPage
)

router.get('/', requireLoggedIn, messageController.getInboxPage)

router.post(
  '/',
  requireLoggedIn,
  uploadStorage.single('messageImage'),
  validate(messageValidation.createMessage),
  uploadMessageImage,
  messageController.createMessage
)

export default router
