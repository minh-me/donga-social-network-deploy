import * as yup from 'yup'
import { transValidations } from '../../lang/en'
import config from './config.validation'
const createChat = {
  chatName: yup.string(),
  isGroupChat: yup.boolean().default(true),
  users: yup
    .array()
    .of(
      yup
        .string()
        .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
        .required()
    ),
}

const getChats = {
  chatName: yup.string(),
  isGroupChat: yup.boolean().default(true),
  unreadOnly: yup.boolean().default(true),
  skip: yup.number(),
  page: yup.number().integer(),
  limit: yup.number().integer(),
  sortBy: yup.string(),
  select: yup.string(),
}

const getChat = {
  chatId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

const updateChat = {
  chatId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  chatName: yup.string(),
  isGroupChat: yup.boolean(),
}

const deleteChat = {
  chatId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

export default {
  createChat,
  getChats,
  getChat,
  updateChat,
  deleteChat,
}
