import createError from 'http-errors'
import { Post, User } from '../models'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * Create post
 * @param {Object} body
 * @returns {Promise<post>}
 */
const createPost = async postBody => {
  const newPost = new Post(postBody)
  await newPost.save()
  await Post.populate(newPost, ['postedBy', 'retweetData', 'replyTo'])
  return newPost
}

/**
 * Get posts by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<posts>}
 */
const queryPosts = async (filter, options) => {
  const customLabels = {
    docs: 'posts',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalPosts',
  }
  options = { ...options, customLabels }
  const posts = await Post.paginate(filter, options)
  return posts
}

/**
 * Find post by id
 * @param {Object} filter
 * @returns {Promise<posts>}
 */
const getPosts = async filter => {
  const posts = await Post.find(filter)
    .populate('postedBy')
    .populate({
      path: 'replyTo',
      populate: {
        path: 'postedBy',
      },
    })
  return posts
}
/**
 * Find post by id
 * @param {Object} filter
 * @returns {Promise<post>}
 */
const getPost = async filter => {
  const post = await Post.findOne(filter)
    .populate('postedBy')
    .populate({
      path: 'replyTo',
      populate: {
        path: 'postedBy',
      },
    })
  return post
}

/**
 * Find user by username
 * @param {Object} filter
 * @returns {Promise<Number>}
 */
const getTotalPosts = async (filter = {}) => {
  const totalPosts = await Post.countDocuments(filter)
  return totalPosts
}

/**
 * Find post by id
 * @param {ObjectId} postId
 * @returns {Promise<post>}
 */
const getPostById = async postId => {
  const post = await Post.findById(postId)
    .populate('postedBy')
    .populate({
      path: 'replyTo',
      populate: {
        path: 'postedBy',
      },
    })
  return post
}

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} body
 * @returns {Promise<post>}
 */
const updatePostById = async (postId, postBody) => {
  const postUpdated = await Post.findByIdAndUpdate(postId, postBody, {
    new: true,
  })
    .populate('postedBy')
    .populate({
      path: 'replyTo',
      populate: {
        path: 'postedBy',
      },
    })
  if (!postUpdated) {
    throw createError.NotFound()
  }
  return postUpdated
}

/**
 * Update post by id
 * @param {Object} filter
 * @param {Object} postBody
 * @returns {Promise<posts>}
 */
const updatePosts = async (filter, postBody) => {
  const posts = await Post.updateMany(filter, postBody, { new: true })
  return posts
}

/**
 * Delte post by id
 * @param {ObjectId} postId
 * @returns {Promise<post>}
 */
const deletePostById = async postId => {
  const post = await getPostById(postId)
  if (!post) {
    throw createError.NotFound()
  }
  const result = await post.remove()
  return result
}

/**
 * Delte post by id
 * @param {Object} filter
 * @returns {Promise<post>}
 */
const deletePost = async filter => {
  const post = await Post.findOneAndDelete(filter)
  return post
}
/**
 * Delte post by id
 * @param {Object} filter
 * @returns {Promise<post>}
 */
const deleteManyPost = async filter => {
  const posts = await Post.deleteMany(filter)
  return posts
}

/**
 * Get top posts by number likes
 * @param {Object} options
 * @returns {Promise<posts>}
 */
const getPostsBySortNumberLikes = async options => {
  let sort = { numberLikes: -1, numberRetweetUsers: -1 }
  if (options.sortBy === 'numberLikes') {
    sort.numberLikes = 1
  }

  let page = options.page || 1
  let limit = options.limit || 10
  limit = parseInt(limit, 10)
  const skip = (page - 1) * limit
  const totalPosts = await Post.countDocuments({})
  const totalPages = Math.ceil(totalPosts / limit)

  const posts = await Post.aggregate([
    {
      $lookup: {
        from: User.collection.name,
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy',
      },
    },
    {
      $unwind: {
        path: '$postedBy',
      },
    },
    {
      $project: {
        numberLikes: { $size: '$likes' },
        numberRetweetUsers: { $size: '$retweetUsers' },
        _id: '$_id',
        id: '$_id',
        postedBy: '$postedBy',
        content: '$content',
        likes: '$likes',
        retweetUsers: '$retweetUsers',
        createdAt: '$createdAt',
      },
    },
    { $match: { content: { $ne: null } } },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ])
  const result = {
    posts,
    page,
    limit,
    totalPosts,
    totalPages,
  }
  return result
}
export default {
  createPost,
  queryPosts,
  getPosts,
  getPost,
  getPostById,
  getTotalPosts,
  updatePostById,
  updatePosts,
  deletePostById,
  deletePost,
  deleteManyPost,
  getPostsBySortNumberLikes,
}
