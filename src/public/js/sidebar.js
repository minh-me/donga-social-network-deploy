const refreshNotificationsBadge = async () => {
  const data = await httpGet(`/notifications/content?opened=false`)
  if (data.totalNotifications > 0) {
    $('.notification-badge').classList.add('active')
    $('.notification-badge').innerHTML = data.totalNotifications
    return
  }
}

const refreshMessagesBadge = async () => {
  const data = await httpGet(`/chats?unreadOnly=true`)
  if (data.length > 0) {
    $('.message-badge').classList.add('active')
    $('.message-badge').innerHTML = data.length
    return
  }
}

refreshNotificationsBadge()
refreshMessagesBadge()
