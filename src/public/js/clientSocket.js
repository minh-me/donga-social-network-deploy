let connected = false
const socket = io()

socket.emit('setup', userLoggedIn)

socket.on('connected', () => (connected = true))

socket.on('message-received', message => {
  // Update chat list
  const chatReceivedId = message.chat.id
  const chatItemContainer = $(`.list__item-link[data-id="${chatReceivedId}"]`)
  chatItemContainer.querySelector('.subText.ellipsis span').innerHTML =
    message.content

  chatItemContainer.querySelector('.text-xs').innerHTML = timeDifference(
    new Date(),
    new Date(message.createdAt)
  )

  addChatMessage(message)
})

socket.on('notification-received', async newNotification => {
  const { notification } = await httpGet('/notifications/latest')
  alertify.set('notifier', 'position', 'top-right')

  let notifyHtml = `<div class="toast-notify">${createNotificationItemHtml(
    notification
  )}</div>`
  alertify.success(notifyHtml)
  refreshNotificationsBadge()
  // refreshMessagesBadge()
})

function emitNotification(userId) {
  if (userId == userLoggedIn.id) return
  socket.emit('notification-received', userId)
}
