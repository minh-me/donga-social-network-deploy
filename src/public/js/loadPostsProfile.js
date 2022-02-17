// Load posts
const loadPostsProfile = async () => {
  let limit = 5

  let isReply = selectedTab === 'replies' ? true : false
  const data = await httpGet(
    `/posts?postedBy=${profileUserId}&isReply=${isReply}&sortBy=createdAt&page=1&limit=${limit}`
  )
  const { posts, totalPages, page } = data
  $('.lds-profile').remove()
  $('.profile-wrapper.hidden').classList.remove('hidden')

  // ================================
  // READMORE
  // ================================
  if (+page < totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.posts_container').insertAdjacentHTML('afterend', buttonShowMore)
  }
  let buttonShowMore = $('.profile-wrapper .show-more__container')
  if (buttonShowMore)
    buttonShowMore.onclick = async e => {
      let nextPage = Math.ceil($$('.posts_container .post').length / limit + 1)
      console.log({ nextPage })
      const data = await httpGet(
        `/posts?postedBy=${profileUserId}&sortBy=createdAt:desc&page=${nextPage}&limit=${limit}`
      )
      if (+data.page >= data.totalPages) {
        buttonShowMore.remove()
      }

      if (data.posts.length > 0)
        return data.posts.forEach(post =>
          outputPost(post, '.posts_container', 'beforeend')
        )
    }
  // ================================
  // END READMORE
  // ================================

  if (posts.length == 0)
    return $('.posts_container').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  let postPinned
  posts.forEach(post => {
    if (post.pinned) postPinned = post
    else outputPost(post, '.posts_container')
  })
  if (postPinned) {
    outputPost(postPinned, '.posts_container')
    $('.posts_container').querySelector('.post').classList.add('post-pinned')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPostsProfile()
})
