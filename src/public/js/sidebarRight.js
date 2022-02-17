// Search
const submitSearchUserSidebarRight = async (keyword, options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 10
  const sortBy = options?.sortBy || 'createdAt:desc'
  const select = options?.select || ''

  const data = await httpGet(
    `/users?search=users&page=${page}&limit=${limit}&sortBy=${sortBy}&select=${select}`
  )
  // Hide spinner

  // Result: Search type = users
  if (data.users) {
    location.href = '/search'
  }
}
// Search
if ($('#searchUserInput'))
  $('#searchUserInput').onkeyup = e => {
    const input = e.target
    const value = input.value
    const searchType = input.dataset.search
    let searchButton = input.parentElement.querySelector('#searchUserButton')

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
      submitSearchUserSidebarRight(value)
      input.value = ''
    }
    if (value && e.keyCode === 13) {
      submitSearchUserSidebarRight(value)
      input.value = ''
    }
  }
