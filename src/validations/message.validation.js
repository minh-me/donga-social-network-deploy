import * as yup from 'yup'
import { transValidations } from '../../lang/en'
import config from './config.validation'
const createMessage = {
  content: yup.string(),
  chat: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  readBy: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  sender: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  messageImage: yup.string(),
}

const getMessages = {
  content: yup.string(),
  chat: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  readBy: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  sender: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect),
  skip: yup.number(),
  page: yup.number().integer(),
  limit: yup.number().integer(),
  sortBy: yup.string(),
  select: yup.string(),
}

const getMessage = {
  messageId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

const updateMessage = {
  messageId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  messageName: yup.string(),
  isGroupMessage: yup.boolean().default(true),
}

const deleteMessage = {
  messageId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

export default {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
}
