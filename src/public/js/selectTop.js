const getTopFollowers = async (options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 3
  const sortBy = options?.sortBy || 'followers:desc'

  const data = await httpGet(
    `/users/sort?sortBy=${sortBy}&page=${page}&limit=${limit}`
  )

  if (+data.page < data.totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.topUserFollowers').insertAdjacentHTML('beforeend', buttonShowMore)
  }

  let buttonShowMoreUserFollowers = $('.topUserFollowers .show-more__container')
  if (buttonShowMoreUserFollowers) {
    buttonShowMoreUserFollowers.onclick = async e => {
      let nextPage = Math.ceil(
        $$('.topUserFollowers .users_container .user').length / limit + 1
      )
      const data = await httpGet(
        `/users/sort?sortBy=followers:desc&page=${nextPage}&limit=${limit}`
      )
      if (data.page >= data.totalPages) {
        buttonShowMoreUserFollowers.remove()
      }

      if (data.users.length > 0)
        return data.users.forEach(user =>
          outputUser(user, '.topUserFollowers .users_container', 'beforeend')
        )
    }
  }

  data.users.forEach(user =>
    outputUser(user, '.topUserFollowers .users_container', 'beforeend')
  )
}

const getTopPosts = async (options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 3
  const sortBy = options?.sortBy || 'likes:desc'

  const data = await httpGet(
    `/posts/sort?sortBy=${sortBy}&page=${page}&limit=${limit}`
  )

  if (+data.page < data.totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.topPostLikes').insertAdjacentHTML('beforeend', buttonShowMore)
  }

  let buttonShowMoreTopPost = $('.topPostLikes .show-more__container')
  if (buttonShowMoreTopPost) {
    buttonShowMoreTopPost.onclick = async e => {
      let nextPage = Math.ceil(
        $$('.topPostLikes .posts_container .post').length / limit + 1
      )
      const data = await httpGet(
        `/posts/sort?sortBy=likes:desc&page=${nextPage}&limit=${limit}`
      )
      if (data.page >= data.totalPages) {
        buttonShowMoreTopPost.remove()
      }

      if (data.posts.length > 0)
        return data.posts.forEach(post =>
          outputPostSidebarRight(
            post,
            '.sidebarRight_container .posts_container',
            'beforeend'
          )
        )
    }
  }

  data.posts.forEach(post =>
    outputPostSidebarRight(
      post,
      '.sidebarRight_container .posts_container',
      'beforeend'
    )
  )
}

document.addEventListener('DOMContentLoaded', () => {
  getTopFollowers()
  getTopPosts()
})
