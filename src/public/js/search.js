// Render result user search
const renderUserSearch = users => {
  $('.users').innerHTML = ''
  // render users
  if (users.length === 0)
    return $('.users').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  users.forEach(user => {
    if (user.id !== userLoggedIn.id) outputUser(user)
  })
  follow()
}
// Render result post search
const renderPostsSearch = posts => {
  $('.posts').innerHTML = ''
  // render users
  if (posts.length === 0)
    return $('.posts').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  posts.forEach(post => outputPost(post))
}
// Search
const submitSearch = async (keyword, searchType = 'users', options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 10
  const sortBy = options?.sortBy || 'createdAt:desc'
  const select = options?.select || ''

  const url = searchType === 'users' ? '/users' : '/posts'
  const data = await httpGet(
    `${url}?search=${keyword}&page=${page}&limit=${limit}&sortBy=${sortBy}&select=${select}`
  )
  // Hide spinner
  $('.lds-search').classList.add('hidden')

  // Result: Search type = users
  if (data.users) {
    // ================================
    // READMORE
    // ================================
    const { totalPages, page } = data
    if (+page < totalPages) {
      let buttonShowMore =
        '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
      $('.users').insertAdjacentHTML('afterend', buttonShowMore)
    }

    let buttonShowMore = $('.users_container .show-more__container')
    if (buttonShowMore)
      buttonShowMore.onclick = async e => {
        let nextPage = Math.ceil($$('.users .user').length / limit + 1)
        const data = await httpGet(
          `${url}?search=${keyword}&page=${nextPage}&limit=${limit}&sortBy=${sortBy}&select=${select}`
        )
        if (+data.page >= data.totalPages) {
          buttonShowMore.remove()
        }

        if (data.users.length > 0) {
          return data.users.forEach(user => {
            if (user.id !== userLoggedIn.id)
              outputUser(user, '.users', 'beforeend')
          })
        }
      }
    // ================================
    // END READMORE
    // ================================
    return renderUserSearch(data.users)
  }

  // Result: Search type = posts
  if (data.posts) {
    // ================================
    // READMORE
    // ================================
    const { totalPages } = data
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
          `${url}?search=${keyword}&page=${nextPage}&limit=${limit}&sortBy=${sortBy}&select=${select}`
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

    return renderPostsSearch(data.posts)
  }
}
// Search
$('#searchInput').onkeyup = e => {
  const input = e.target
  const value = input.value
  const searchType = input.dataset.search
  let searchButton = input.parentElement.querySelector('#searchButton')

  // disabled button search
  if (!value) {
    searchButton.setAttribute('disabled', true)
    searchButton.classList.remove('text-primary')
    return
  }

  // remove disabled button search
  searchButton.removeAttribute('disabled')
  searchButton.classList.add('text-primary')

  // Submit
  searchButton.onclick = () => {
    // Remove button show more when submit
    let buttonShowMore = $('.users_container .show-more__container')
    if (buttonShowMore) {
      buttonShowMore.classList.remove()
    }

    // add spinner
    $('.lds-search').classList.remove('hidden')

    submitSearch(value, searchType)
    input.value = ''
  }
  if (value && e.keyCode === 13) {
    // Remove button show more when submit
    let buttonShowMore = $('.users_container .show-more__container')
    if (buttonShowMore) {
      buttonShowMore.classList.remove()
    }
    // add spinner
    $('.lds-search').classList.remove('hidden')
    submitSearch(value, searchType)
    input.value = ''
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let options = {
    page: 1,
    limit: 4,
  }
  if (selectedTab === 'users') return submitSearch('', 'users', options)

  submitSearch({}, 'posts', options)
})
