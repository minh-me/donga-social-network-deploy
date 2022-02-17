import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import {
  postService,
  uploadService,
  userService,
  notificationService,
} from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

/**
 * Create a post
 * @POST posts/
 * @access private
 */
const createPost = catchAsync(async (req, res) => {
  if (req.file) {
    const url = await uploadService.uploadPostImage(req.file.path)
    req.body = { ...req.body, image: url }
  }

  if (req.body.replyTo) {
    const replyPost = await postService.updatePostById(req.body.replyTo, {
      $push: { replyUsers: req.user.id },
    })

    // Send notifications
    if (
      JSON.stringify(replyPost.postedBy._id) !== JSON.stringify(req.user._id)
    ) {
      await notificationService.createNotificationPostReply(
        replyPost.postedBy._id,
        req.user._id,
        replyPost._id
      )
    }
  }
  const post = await postService.createPost({
    ...req.body,
    postedBy: req.user.id,
  })
  res.status(201).json({ post, message: tranSuccess.created_success('post') })
})

/**
 * Get all posts
 * @GET posts/
 * @access private
 */
const getPosts = catchAsync(async (req, res) => {
  let searchObj = req.query
  let filter = pick(searchObj, ['postedBy'])

  const searchContent = { $regex: new RegExp(searchObj.search, 'i') }
  if (searchObj.search) {
    filter = {
      ...filter,
      content: searchContent,
    }
  }

  if (searchObj.followingOnly !== undefined) {
    let followingOnly = searchObj.followingOnly == 'true'

    if (followingOnly) {
      let objectIds = []

      if (!req.user.following) {
        req.user.following = []
      }
      req.user.following.forEach(user => objectIds.push(user))
      objectIds.push(req.user._id)

      filter = {
        ...filter,
        postedBy: { $in: objectIds },
      }
    }

    delete searchObj.followingOnly
  }

  if (searchObj.isReply !== undefined) {
    filter = {
      ...filter,
      replyTo: { $exists: searchObj.isReply },
    }
  }

  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  options.populate =
    'postedBy,retweetData,retweetData.postedBy,replyTo,replyTo.postedBy'
  const result = await postService.queryPosts(filter, options)

  res.send(result)
})

/**
 * Get a post by post id
 * @GET /posts/:postId
 * @access public
 */
const getPost = catchAsync(async (req, res) => {
  let post = await postService.getPostById(req.params.postId)
  // let replies = []
  const isReplyPost = !!post.replyTo

  if (isReplyPost) {
    post = await postService.getPostById(post.replyTo._id)
  }

  // Get all replies
  let filter = { replyTo: post.id }
  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  options.populate =
    'postedBy,retweetData,retweetData.postedBy,replyTo,replyTo.postedBy'
  const replies = await postService.queryPosts(filter, options)

  if (!post) res.redirect('/not-found')
  res.render('view-post', {
    post: JSON.stringify(post),
    replies: JSON.stringify(replies.posts),
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'View post',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
  })
})

/**
 * Update a post by postId
 * @PATCH posts/:postId
 * @access private
 */
const updatePost = catchAsync(async (req, res) => {
  if (req.body.pinned) {
    await postService.updatePosts(
      { postedBy: req.user._id, pinned: true },
      { pinned: false }
    )
  }

  const postUpdated = await postService.updatePostById(
    req.params.postId,
    req.body
  )
  res.status(200).json({ postUpdated, message: tranSuccess.updated_success })
})

/**
 * Delete post by postId
 * @DELETE posts/:postId
 * @access private
 */
const deletePost = catchAsync(async (req, res) => {
  let filter = {
    postedBy: req.user._id,
    _id: req.params.postId,
  }
  const post = await postService.deletePost(filter)
  if (!post) throw createError.NotFound('Not found post')
  return res
    .status(200)
    .json({ post, message: tranSuccess.deleted_success('post') })
})

/**
 * Like post
 * @PATCH posts/:postId/like
 * @access private
 */
const likePost = catchAsync(async (req, res) => {
  const { postId } = req.params
  const user = req.user
  const isLiked = user.likes && user.likes.includes(postId)
  const options = isLiked ? '$pull' : '$addToSet'
  await userService.updateUser(
    { _id: user.id },
    {
      [options]: { likes: postId },
    }
  )
  const postUpdated = await postService.updatePostById(postId, {
    [options]: { likes: user.id },
  })

  // Send notifications
  if (
    !isLiked &&
    JSON.stringify(postUpdated.postedBy._id) !== JSON.stringify(user._id)
  ) {
    await notificationService.createNotificationPostLiked(
      postUpdated.postedBy._id,
      user._id,
      postUpdated._id
    )
  }

  res.status(200).json({ post: postUpdated })
})

/**
 * Like post
 * @PATCH posts/:postId/retweet
 * @access private
 */
const retweetPost = catchAsync(async (req, res) => {
  // Get content
  const { postId } = req.params
  const userId = req.user._id

  // Try and delete post
  const deletedPost = await postService.deletePost({
    postedBy: userId,
    retweetData: postId,
  })

  // Create options
  let option = deletedPost ? '$pull' : '$addToSet'
  let repost = deletedPost

  // If not found repost => create new post
  if (!repost) {
    const newItem = {
      postedBy: userId,
      retweetData: postId,
    }
    repost = await postService.createPost(newItem)
  }

  // Insert user retweet
  req.user = await userService.updateUser(
    { _id: userId },
    {
      [option]: { retweets: repost._id },
    }
  )

  // Insert post retweet
  let post = await postService.updatePostById(postId, {
    [option]: { retweetUsers: userId },
  })

  // Send notifications
  if (!deletedPost && post.postedBy._id != userId) {
    await notificationService.createNotificationPostRetweet(
      post.postedBy._id,
      userId,
      post._id
    )
  }

  post = await User.populate(repost, [
    'postedBy',
    'retweetData',
    'retweetData.postedBy',
  ])

  // Success
  res.status(200).json({ message: 'Chia sẻ bài viết thành công.', post })
})

const getTopPosts = catchAsync(async (req, res, next) => {
  const options = pick(req.query, ['sortBy', 'page', 'limit'])
  let result = await postService.getPostsBySortNumberLikes(options)
  res.status(200).json(result)
})

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  retweetPost,
  getTopPosts,
}
