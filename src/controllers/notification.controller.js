import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { chatService, notificationService, userService } from '../services'
import User from '../models/user.model'
import { tranSuccess } from '../../lang/vi'

/**
 * Create a new notification
 * @POST notifications/:
 * @access private
 */
const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body)
  res.status(200).json({ notification })
})

/**
 * Get notification by chatId
 * @GET notifications/:chatId
 * @access public
 */
const getNotifications = catchAsync(async (req, res) => {
  let filter = pick(req.query, [
    'userFrom',
    'notificationType',
    'opened',
    'entityId',
  ])
  filter.userTo = req.user.id
  filter.notificationType = { $ne: 'newMessage' }
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'select', 'skip'])
  options.populate = 'userTo,userFrom'
  const data = await notificationService.queryNotifications(filter, options)
  res.status(200).json({ ...data })
})

/**
 * Get notification latest
 * @GET notifications/latest
 * @access public
 */
const getNotificationLatest = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotification({
    userTo: req.user.id,
  })
  res.status(200).json({ notification })
})

/**
 * Get a notification by notification id
 * @GET notifications/:notificationId
 * @access public
 */
const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(
    req.params.notificationId
  )
  res.status(200).json({ notification })
})

/**
 * Update a notification by notificationId
 * @PATCH notifications/:notificationId
 * @access private
 */
const updateNotifications = catchAsync(async (req, res) => {
  let filter = {
    userTo: req.user._id,
    opened: false,
  }
  const notificationUpdated = await notificationService.updateNotifications(
    filter,
    req.body
  )
  res.status(200).json({ notificationUpdated })
})
/**
 * Update a notification by notificationId
 * @PATCH notifications/:notificationId
 * @access private
 */
const updateNotification = catchAsync(async (req, res) => {
  const notificationUpdated = await notificationService.updateNotificationById(
    req.params.notificationId,
    req.body
  )
  res.status(200).json({ notificationUpdated })
})

/**
 * Delete notification by notificationId
 * @DELETE notifications/:notificationId
 * @access private
 */
const deleteNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.deleteNotificationById(
    req.params.notificationId
  )
  if (!notification) throw createError.NotFound('Not found notification')
  return res.status(200).json({
    message: tranSuccess.deleted_success('notification'),
  })
})

export default {
  createNotification,
  getNotifications,
  getNotification,
  getNotificationLatest,
  updateNotification,
  updateNotifications,
  deleteNotification,
}
