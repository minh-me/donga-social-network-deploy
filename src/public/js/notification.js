// Load notifications
;(async () => {
  let limit = 10
  const data = await httpGet(
    `/notifications/content?sortBy=createdAt:desc&page=1&limit=${limit}`
  )
  if (data.notifications.length === 0)
    return $('.notifications-list').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )
  if (data.notifications.some(notification => !notification.opened)) {
    $('#markNotificationsAsRead').classList.add('active')
  }

  // ================================
  // READMORE
  // ================================
  const { totalPages, page } = data
  if (+page < totalPages) {
    let buttonShowMore =
      '<div class="show-more__container text-center my-3"><span>xem thêm</span></div>'
    $('.notifications-list').insertAdjacentHTML('afterend', buttonShowMore)
  }

  let buttonShowMore = $('.notifications-container .show-more__container')
  if (buttonShowMore)
    buttonShowMore.onclick = async e => {
      let nextPage = Math.ceil(
        $$('.notifications-list .list__item-link').length / limit + 1
      )
      const data = await httpGet(
        `/notifications/content?sortBy=createdAt:desc&page=${nextPage}&limit=${limit}`
      )
      if (+data.page >= data.totalPages) {
        buttonShowMore.remove()
      }

      if (data.notifications.length > 0) {
        return data.notifications.forEach(notification =>
          outputNotificationItem(notification)
        )
      }
    }
  // ================================
  // END READMORE
  // ================================

  data.notifications.forEach(notification =>
    outputNotificationItem(notification)
  )
})()

let notificationId = ''
let notificationItemContainer = ''
// mark a notificaiton as read
$('.notifications-list').onclick = async e => {
  const notificationItemEl = e.target.closest('.list__item-link.active')
  if (notificationItemEl) {
    // Mark as read
    notificationId = e.target.closest('.list__item-link.active').dataset.id
    await httpPatch(`/notifications/${notificationId}`, { opened: true })
    return
  }

  // Remove notifications
  if (e.target.closest('.btn-delete-notification')) {
    notificationItemContainer = e.target.parentElement.parentElement
    notificationId = notificationItemContainer.dataset.id
  }
}

$('#deleteNotificationModal').addEventListener('shown.bs.modal', async e => {
  e.target.onclick = async e => {
    if (e.target.closest('#submitDeleteNotification')) {
      await httpDelete(`/notifications/${notificationId}`)
      notificationItemContainer.remove()
    }
  }
})

// mark all notifications as read
$('span#markNotificationsAsRead').onclick = async e => {
  await httpPatch(`/notifications/markAsOpened`, { opened: true })
  $$('.list__item-link.active').forEach(li => li.classList.remove('active'))
  $('span#markNotificationsAsRead').classList.remove('active')
  $('.notification-badge').classList.remove('active')
}
