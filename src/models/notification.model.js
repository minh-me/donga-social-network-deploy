import mongoose, { Schema } from 'mongoose'
import toJSON from './plugins/toJson'
import paginate from './plugins/paginate'

const notificationSchema = new Schema(
  {
    userTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notificationType: String,
    opened: { type: Boolean, default: false },
    entityId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON)
notificationSchema.plugin(paginate)

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
