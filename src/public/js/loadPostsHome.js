// Load posts
const loadPostsHome = async () => {
  let limit = 8
  const data = await httpGet(
    `/posts/?followingOnly=true&isReply=false&sortBy=createdAt:desc&page=1&limit=${limit}`
  )
  let { posts, totalPages, page } = data
  $('.lds__post-home').remove()
  $('.posts').classList.remove('hidden')
  // ================================
  // READMORE
  // ================================
  if (+page < totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.posts').insertAdjacentHTML('afterend', buttonShowMore)
  }

  let buttonShowMore = $('.posts_container .show-more__container')
  if (buttonShowMore)
    buttonShowMore.onclick = async e => {
      let nextPage = Math.ceil($$('.posts .post').length / limit + 1)
      const data = await httpGet(
        `/posts/?followingOnly=true&sortBy=createdAt:desc&page=${nextPage}&limit=${limit}`
      )
      if (+data.page >= data.totalPages) {
        buttonShowMore.remove()
      }

      if (data.posts.length > 0)
        return data.posts.forEach(post =>
          outputPost(post, '.posts_container .posts', 'beforeend')
        )
    }
  // ================================
  // END READMORE
  // ================================

  if (posts.length > 0)
    return posts.forEach(post =>
      outputPost(post, '.posts_container .posts', 'beforeend')
    )

  Swal.fire({
    title: `Xin chào bạn <span class="text-primary"> ${userLoggedIn.fullName}</span>`,
    text: 'Bạn có muốn tìm kiếm bạn bè quanh đây không?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Để sau',
    confirmButtonText: 'Có 😀',
    background: '#15202b',
  }).then(result => {
    if (result.isConfirmed) return (window.location.href = '/search')

    $('.posts').innerHTML = `
        <div class="posts-empty text-center d-flex align-items-center px-4" style="height: 200px;">
          <p class="w-100">Bạn chưa có bài viết, tìm kiếm bạn bè quanh đây
            <a class="text-primary" href="/search">tìm bạn bè</a> hoặc đăng bài viết?
          </p>
        </div>
      `
  })
}

loadPostsHome()
