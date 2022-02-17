import createError from 'http-errors'
import { Chat, User } from '../models'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * Create chat
 * @param {Object} body
 * @returns {Promise<chat>}
 */
const createChat = async chatBody => {
  const newChat = Chat.create(chatBody)
  return newChat
}

/**
 * Get chats by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<chats>}
 */
const queryChats = async (filter, options) => {
  const customLabels = {
    docs: 'chats',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalChats',
  }
  options = { ...options, customLabels }
  const chats = await Chat.paginate(filter, options)
  return chats
}

/**
 * Find chat by id
 * @param {Object} filter
 * @returns {Promise<chats>}
 */
const getChats = async filter => {
  const chats = await Chat.find(filter)
  return chats
}
/**
 * Find chat by id
 * @param {Object} filter
 * @returns {Promise<chat>}
 */
const getChat = async filter => {
  return Chat.findOne(filter).populate('users')
}

/**
 * Find user by username
 * @param {Object} filter
 * @returns {Promise<Number>}
 */
const getTotalChats = async (filter = {}) => {
  const totalChats = await Chat.countDocuments(filter)
  return totalChats
}

/**
 * Find chat by id
 * @param {ObjectId} chatId
 * @returns {Promise<chat>}
 */
const getChatById = async chatId => {
  const chat = await Chat.findById(chatId).populate('users')
  return chat
}

/**
 * Update chat by id
 * @param {ObjectId} chatId
 * @param {Object} body
 * @returns {Promise<chat>}
 */
const updateChatById = async (chatId, chatBody) => {
  const chatUpdated = await Chat.findByIdAndUpdate(chatId, chatBody, {
    new: true,
  })
  if (!chatUpdated) {
    throw createError.NotFound()
  }
  return chatUpdated
}

/**
 * Update chat
 * @param {Object} filter
 * @param {Object} body
 * @returns {Promise<chat>}
 */
const updateChat = async (
  filter,
  chatBody,
  options = {
    new: true,
  }
) => {
  const chatUpdated = await Chat.findOneAndUpdate(
    filter,
    chatBody,
    options
  ).populate('users')
  if (!chatUpdated) {
    throw createError.NotFound()
  }
  return chatUpdated
}

/**
 * Update chat by id
 * @param {Object} filter
 * @param {Object} chatBody
 * @returns {Promise<chats>}
 */
const updateChats = async (filter, chatBody) => {
  const chats = await Chat.updateMany(filter, chatBody, { new: true })
  return chats
}

/**
 * Delte chat by id
 * @param {ObjectId} chatId
 * @returns {Promise<chat>}
 */
const deleteChatById = async chatId => {
  const chat = await getChatById(chatId)
  if (!chat) {
    throw createError.NotFound()
  }
  const result = await chat.remove()
  return result
}

/**
 * Delte chat by id
 * @param {Object} filter
 * @returns {Promise<chat>}
 */
const deleteChat = async filter => {
  const chat = await Chat.findOneAndDelete(filter)
  return chat
}
/**
 * Delte chat by id
 * @param {Object} filter
 * @returns {Promise<chat>}
 */
const deleteManyChat = async filter => {
  const chats = await Chat.deleteMany(filter)
  return chats
}

export default {
  createChat,
  queryChats,
  getChats,
  getChat,
  getTotalChats,
  getChatById,
  updateChatById,
  updateChat,
  updateChats,
  deleteChatById,
  deleteChat,
  deleteManyChat,
}
