import mongoose, { Schema } from 'mongoose'
import paginate from './plugins/paginate'
import toJSON from './plugins/toJson'

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
chatSchema.plugin(toJSON)
chatSchema.plugin(paginate)

/**
 * @typedef Chat
 */
const Chat = mongoose.model('Chat', chatSchema)

export default Chat
