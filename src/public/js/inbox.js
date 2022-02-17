// Get chat list
const getChatList = async (options = {}) => {
  const limit = options?.limit || 5
  const sortBy = options?.sortBy || 'updatedAt:desc'

  const data = await httpGet(`/chats?sortBy=${sortBy}&page=1&limit=${limit}`)
  if (data.chats.length === 0)
    return $('.chat-list').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  // ================================
  // READMORE
  // ================================
  const { totalPages, page } = data
  if (+page < totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.chat-list').insertAdjacentHTML('afterend', buttonShowMore)
  }

  let buttonShowMore = $('.chats-container .show-more__container')
  if (buttonShowMore)
    buttonShowMore.onclick = async e => {
      let nextPage = Math.ceil(
        $$('.chat-list .list__item-link').length / limit + 1
      )
      const data = await httpGet(
        `/chats?sortBy=${sortBy}&page=${nextPage}&limit=${limit}`
      )
      if (+data.page >= data.totalPages) {
        buttonShowMore.remove()
      }

      if (data.chats.length > 0) {
        return data.chats.forEach(chat => outputChatListItem(chat))
      }
    }
  // ================================
  // END READMORE
  // ================================

  data.chats.forEach(chat => outputChatListItem(chat))
}
let iboxId = ''
// Mark as read message
$('.chat-list').onclick = async e => {
  let chatItemEl = e.target.closest('.list__item-link.active')
  if (chatItemEl) {
    iboxId = chatItemEl.dataset.id
    await httpPatch(`/chats/${iboxId}/markAsRead`, {})
    return
  }

  // Delete ibox item
}

document.addEventListener('DOMContentLoaded', () => {
  getChatList()
})
