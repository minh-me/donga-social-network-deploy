import { Router } from 'express'
import { notificationController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'
import validate from '../middlewares/validate'
import { notificationValidation } from '../validations'

const router = new Router()

router.get(
  '/latest',
  requireLoggedIn,
  validate(notificationValidation.getNotifications),
  notificationController.getNotificationLatest
)

router.get(
  '/content',
  requireLoggedIn,
  validate(notificationValidation.getNotifications),
  notificationController.getNotifications
)

router.patch(
  '/markAsOpened',
  requireLoggedIn,
  notificationController.updateNotifications
)

router.patch(
  '/:notificationId',
  requireLoggedIn,
  validate(notificationValidation.updateNotification),
  notificationController.updateNotification
)

router.delete(
  '/:notificationId',
  requireLoggedIn,
  validate(notificationValidation.deleteNotification),
  notificationController.deleteNotification
)

router.get('/', requireLoggedIn, async (req, res) => {
  res.render('notifications', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Notifications',
    selectedPage: 'notification',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
  })
})

export default router
