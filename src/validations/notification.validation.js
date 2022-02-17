import * as yup from 'yup'
import { transValidations } from '../../lang/en'
import config from './config.validation'
const createNotification = {
  userTo: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  userFrom: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  opened: yup.boolean().default(false),
  entityId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  notificationType: yup.string(),
}

const getNotifications = {
  userTo: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  userFrom: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  opened: yup.boolean().default(false),
  unreadOnly: yup.boolean().default(true),
  entityId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  notificationType: yup.string(),
  skip: yup.number(),
  page: yup.number().integer(),
  limit: yup.number().integer(),
  sortBy: yup.string(),
  select: yup.string(),
}

const getNotification = {
  notificationId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

const updateNotification = {
  notificationId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  opened: yup.boolean().required(),
}

const deleteNotification = {
  notificationId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

export default {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
}
