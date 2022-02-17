import createError from 'http-errors'
import { Notification } from '../models'
const notificationType = {
  postLike: 'postLike',
  postRetweet: 'postRetweet',
  follow: 'follow',
  postReply: 'reply',
  newMessage: 'newMessage',
}

/**
 * Create notification
 * @param {Object} body
 * @returns {Promise<notification>}
 */
const createNotification = async notificationBody => {
  await Notification.deleteOne(notificationBody)
  const newNotification = new Notification(notificationBody)
  await newNotification.save()
  return newNotification
}

/**
 * Create notification
 * @param {ObjectId} userTo
 * @param {ObjectId} userFrom
 * @param {String} notificationType
 * @param {ObjectId} entityId
 * @returns {Promise<notification>}
 */
const sendNotification = async (
  userTo,
  userFrom,
  notificationType,
  entityId
) => {
  const notificationItem = {
    userTo,
    userFrom,
    notificationType,
    entityId,
  }
  return await createNotification(notificationItem)
}

/**
 * Create notification
 * @param {Object} body
 * @returns {Promise<notification>}
 */
const createNotificationNewMessage = async (chat, message) => {
  chat.users.forEach(async userId => {
    if (userId != message.sender.id)
      await sendNotification(
        userId,
        message.sender.id,
        notificationType.newMessage,
        message.chat._id
      )
  })
}

/**
 * Create notification
 * @param {ObjectId} postedById
 * @param {ObjectId} userFrom
 * @param {ObjectId} postId
 * @returns {Promise<notification>}
 */
const createNotificationPostLiked = async (postedById, userFrom, postId) => {
  return await sendNotification(
    postedById,
    userFrom,
    notificationType.postLike,
    postId
  )
}

/**
 * Create notification
 * @param {ObjectId} postedById
 * @param {ObjectId} userFrom
 * @param {ObjectId} postId
 * @returns {Promise<notification>}
 */
const createNotificationPostReply = async (postedById, userFrom, postId) => {
  return await sendNotification(
    postedById,
    userFrom,
    notificationType.postReply,
    postId
  )
}

/**
 * Create notification
 * @param {ObjectId} postedById
 * @param {ObjectId} userFrom
 * @param {ObjectId} postId
 * @returns {Promise<notification>}
 */
const createNotificationPostRetweet = async (postedById, userFrom, postId) => {
  return await sendNotification(
    postedById,
    userFrom,
    notificationType.postRetweet,
    postId
  )
}
/**
 * Create notification
 * @param {ObjectId} postedById
 * @param {ObjectId} userFrom
 * @param {ObjectId} postId
 * @returns {Promise<notification>}
 */
const createNotificationFollow = async (userTo, userFrom, entityId) => {
  return await sendNotification(
    userTo,
    userFrom,
    notificationType.follow,
    entityId
  )
}

/**
 * Get notifications by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<notifications>}
 */
const queryNotifications = async (filter, options) => {
  const customLabels = {
    docs: 'notifications',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalNotifications',
  }
  options = { ...options, customLabels }
  const notifications = await Notification.paginate(filter, options)
  return notifications
}

/**
 * Find notification by id
 * @param {Object} filter
 * @returns {Promise<notifications>}
 */
const getNotifications = async filter => {
  const notifications = await Notification.find(filter)
  return notifications
}

/**
 * Find notification by id
 * @param {Object} filter
 * @returns {Promise<notification>}
 */
const getNotification = async filter => {
  return await Notification.findOne(filter)
    .sort('-createdAt')
    .populate('userTo')
    .populate('userFrom')
}

/**
 * Find notification by id
 * @param {ObjectId} notificationId
 * @returns {Promise<notification>}
 */
const getNotificationById = async notificationId => {
  const notification = await Notification.findById(notificationId)
  return notification
}

/**
 * Find user by username
 * @param {Object} filter
 * @returns {Promise<Number>}
 */
const getTotalNotifications = async (filter = {}) => {
  const totalNotifications = await Notification.countDocuments(filter)
  return totalNotifications
}
/**
 * Update notification by id
 * @param {ObjectId} notificationId
 * @param {Object} body
 * @returns {Promise<notification>}
 */
const updateNotificationById = async (notificationId, notificationBody) => {
  const notificationUpdated = await Notification.findByIdAndUpdate(
    notificationId,
    notificationBody,
    {
      new: true,
    }
  )
  if (!notificationUpdated) {
    throw createError.NotFound()
  }
  return notificationUpdated
}

/**
 * Update notification by id
 * @param {Object} filter
 * @param {Object} notificationBody
 * @returns {Promise<notifications>}
 */
const updateNotifications = async (filter, notificationBody) => {
  const notifications = await Notification.updateMany(
    filter,
    notificationBody,
    { new: true }
  )
  return notifications
}

/**
 * Delte notification by id
 * @param {ObjectId} notificationId
 * @returns {Promise<notification>}
 */
const deleteNotificationById = async notificationId => {
  const notification = await getNotificationById(notificationId)
  if (!notification) {
    throw createError.NotFound()
  }
  const result = await notification.remove()
  return result
}

/**
 * Delte notification by id
 * @param {Object} filter
 * @returns {Promise<notification>}
 */
const deleteNotification = async filter => {
  const notification = await Notification.findOneAndDelete(filter)
  return notification
}

export default {
  createNotification,
  queryNotifications,
  getNotifications,
  getNotification,
  getNotificationById,
  getTotalNotifications,
  updateNotificationById,
  updateNotifications,
  deleteNotificationById,
  deleteNotification,
  createNotificationNewMessage,
  createNotificationPostLiked,
  createNotificationPostRetweet,
  createNotificationFollow,
  createNotificationPostReply,
}
