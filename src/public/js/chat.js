let selectedUsers = []
let selectedUsersName = []

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
    if (user.id !== userLoggedIn.id && !selectedUsers.includes(user.id))
      outputUser(user)
  })
  follow()
}

const submitSearchUser = async (keyword, options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 10
  const sortBy = options?.sortBy || 'createdAt:desc'
  const select = options?.select || ''

  const data = await httpGet(
    `/users?search=${keyword}&page=${page}&limit=${limit}&sortBy=${sortBy}&select=${select}`
  )
  renderUserSearch(data.users)
}

const outputSelectedUsersName = () => {
  $('.selectedUsers').innerHTML = ''

  selectedUsersName.forEach(userName => {
    $('.selectedUsers').insertAdjacentHTML(
      'beforeend',
      `<span class="selectedUser">${userName}</span>`
    )
  })
}

const submitCreateChat = async () => {
  const { chat } = await httpPost(`/chats/`, {
    users: selectedUsers,
  })
  if (!chat || !chat.id)
    return alertify.notify('Invalid response from server', 'error', 6)

  window.location.href = `/messages/${chat.id}`
}

$('#userSearchTextBox').onkeyup = e => {
  const input = e.target
  const value = input.value

  if (!value && e.keyCode === 8 && selectedUsers.length > 0) {
    selectedUsers.pop()
    selectedUsersName.pop()
    outputSelectedUsersName()
  }
  if (selectedUsersName.length <= 1) {
    $('button#createChatButton').setAttribute('disabled', true)
  }
  if (value && e.keyCode === 13) submitSearchUser(value)
}

$('.resultSearchChat').onclick = e => {
  const userElement = e.target.closest('.user')

  let userId = userElement.dataset.id
  let userName = userElement.querySelector(
    '.user__details-container a'
  ).innerHTML
  selectedUsers.push(userId)
  selectedUsersName.push(userName)
  outputSelectedUsersName()
  $('#userSearchTextBox').value = ''
  $('.resultSearchChat .users_container .users').innerHTML = ''
  if (selectedUsers) {
    $('button#createChatButton').removeAttribute('disabled')
  }
}

$('button#createChatButton').onclick = () => submitCreateChat()
