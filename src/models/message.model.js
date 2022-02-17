import mongoose, { Schema } from 'mongoose'
import paginate from './plugins/paginate'
import toJSON from './plugins/toJson'

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    content: {
      type: String,
      trim: true,
    },
    image: String,
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON)
messageSchema.plugin(paginate)

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema)

export default Message
