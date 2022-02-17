// Loaf followers
const loadFollowers = async () => {
  const { user } = await httpGet(`/users/${profileUserId}/followers`)
  const usersFollowers = user.followers
  if (usersFollowers.length == 0)
    return $('.users').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )
  usersFollowers.forEach(user => outputUser(user, '.users_container .users'))
  follow()
}

// Loaf following
const loadFollowing = async () => {
  const { user } = await httpGet(`/users/${profileUserId}/following`)
  const usersFollowing = user.following
  if (usersFollowing.length == 0)
    return $('.users').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )
  usersFollowing.forEach(user => outputUser(user, '.users_container .users'))
  follow()
}

document.addEventListener('DOMContentLoaded', () => {
  if (selectedTab == 'followers') return loadFollowers()
  loadFollowing()
})
