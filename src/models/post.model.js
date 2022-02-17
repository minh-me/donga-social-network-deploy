import mongoose, { Schema } from 'mongoose'
import toJSON from './plugins/toJson'
import paginate from './plugins/paginate'
import createHttpError from 'http-errors'

const postSchema = new Schema(
  {
    content: { type: String, trim: true },
    image: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
    replyUsers: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
)

postSchema.pre('validate', function () {
  if (this.content && this.retweetData) {
    throw createHttpError.InternalServerError(
      'Vui lòng nhập một trong hay trường content hoặc retweetData'
    )
  }
})

// add plugin that converts mongoose to json
postSchema.plugin(toJSON)
postSchema.plugin(paginate)

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema)

export default Post
