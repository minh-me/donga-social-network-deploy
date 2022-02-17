import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import {
  chatService,
  messageService,
  uploadService,
  userService,
} from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

/**
 * Get a post by post id
 * @GET message/::username
 * @access public
 */
const getCreateNewChatPage = (req, res) => {
  res.render('message/new-message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'New Message',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
    selectedPage: 'messages',
  })
}

const getChatByUserId = (userLoggedInId, otherUserId) => {
  const filter = {
    isGroupChat: false,
    users: {
      $size: 2,
      $all: [
        { $elemMatch: { $eq: userLoggedInId } },
        { $elemMatch: { $eq: otherUserId } },
      ],
    },
  }
  const body = {
    $setOnInsert: {
      users: [userLoggedInId, otherUserId],
    },
  }
  const options = {
    new: true,
    upsert: true,
  }

  return chatService.updateChat(filter, body, options)
}

const getChatPage = async (req, res) => {
  const userId = req.user._id
  const chatId = req.params.chatId
  let filter = pick(req.query, ['chatName'])
  filter = {
    ...filter,
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }

  let options = pick(req.query, ['sortBy', 'page', 'limit', 'select'])
  options.populate = 'users'
  const result = await chatService.queryChats(filter, options)

  // check chat in personal
  if (result.chats.length === 0) {
    const user = await userService.getUserById(chatId)
    if (user) {
      const userChat = await getChatByUserId(req.user._id, user._id)
      result.chats.push(userChat)
    }
  }

  if (result.chats.length === 0) {
    req.flash(
      'errors',
      'Chat does not exits or you do not have permission to view it.'
    )
  }

  res.render('message/message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    sidebarChat: true,
    pageTitle: 'Message',
    userLoggedIn: req.user,
    selectedPage: 'messages',
    chat: result.chats[0],
    userLoggedInJs: JSON.stringify(req.user),
  })
}

const getInboxPage = (req, res) => {
  res.render('message/inbox', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Inbox',
    userLoggedIn: req.user,
    selectedPage: 'messages',
    userLoggedInJs: JSON.stringify(req.user),
  })
}

/**
 * Create a new message
 * @POST messages/:
 * @access private
 */
const createMessage = catchAsync(async (req, res) => {
  if (req.file) {
    const url = await uploadService.uploadMessageImage(req.file.path)
    req.body = { ...req.body, image: url }
  }
  const message = await messageService.createMessage({
    ...req.body,
    sender: req.user.id,
  })
  res.status(200).json({ message })
})

/**
 * Get message by chatId
 * @GET messages/:chatId
 * @access public
 */
const getMessages = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['content', 'sender', 'chat', 'readBy'])
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'select', 'skip'])
  options.populate = 'sender,readBy,chat'
  const data = await messageService.queryMessages(filter, options)
  res.status(200).json({ ...data })
})

export default {
  getCreateNewChatPage,
  getChatPage,
  getInboxPage,
  createMessage,
  getMessages,
}
