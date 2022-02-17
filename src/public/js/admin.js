const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const limitUsers = 10
const limitAdmin = 10
const limitPosts = 10

const createUserRow = (user, isAdmin) => {
  let dataUser = {
    id: user.id,
    email:
      user.local?.email || user.facebook?.email || user.google?.email || '',
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  }
  return `
    <tr class="user_row" data-user=${JSON.stringify(dataUser)}>
      <td><input type="checkbox" name="userId" value="${user.id}"></td>
      <td> <img src="${user.profilePic}" /></td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>${
        user.local?.email || user.facebook?.email || user.google?.email || ''
      }</td>
      ${
        !isAdmin
          ? `
      <td>${
        (user.local?.email && 'Local') ||
        (user.facebook?.email && 'Facebook') ||
        (user.google?.email && 'Google') ||
        'email ?'
      }</td>
      <td>${user.local.isActive ? 'Active' : 'Not Activate'}</td>
      `
          : ''
      }
      ${
        !isAdmin
          ? `
        <td>${user.following.length}</td>
        <td>${user.followers.length}</td>
      `
          : ''
      }

      <td>${user.role}</td>
      <td>${new Date(user.createdAt).toISOString().slice(0, 10)}</td>
      <td>
        ${
          !isAdmin
            ? `<button class="btn-update-user btn btn-sm btn-info mx-1" data-bs-toggle="modal" data-bs-target="#updateUserModal">Cấp Quyền </button>
        <button class="btn-delete-user btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal">Xóa</button>
        <button class="btn-reset-password btn btn-sm btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#resetPasswordModal">Reset-Pass</button>
        <button class="btn-verify-email btn btn-sm btn-success mx-1" data-bs-toggle="modal" data-bs-target="#verifyEmailModal" data-type="${
          user.local?.isActive ? 'block' : 'active'
        }" > ${user.local.isActive ? 'Block' : 'Active'}
        </button>`
            : `
          <button class="btn-update-manager btn btn-sm btn-info mx-1" data-bs-toggle="modal" data-bs-target="#createManagerModal">Sửa Quyền </button>
          <button class="btn-delete-manager btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteManagerModal">Xóa</button>
          `
        }
      </td>
    </tr>
  `
}

const createPostRow = post => {
  var content = post.retweetData ? post.retweetData.content : post.content
  let dataPost = {
    id: post.id,
    postedBy: {
      firstName: post.postedBy.firstName,
      lastName: post.postedBy.lastName,
    },
    content: content.split(' ')[0],
  }
  return `
    <tr class="post_row" data-post=${JSON.stringify(dataPost)} >
      <td><input type="checkbox" name="postId" value="${post.id}"></td>
      <td>${post.postedBy.firstName + post.postedBy.lastName}</td>
      <td>${content.length > 10 ? `${content.substr(0, 10)}...` : content}</td>
      <td>${post.likes.length}</td>
      <td>${post.retweetUsers.length}</td>
      <td>${new Date(post.createdAt).toISOString().slice(0, 10)}</td>
      <td><button class="btn btn-delete-post btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deletePostModal">Xóa</button></td>
    </tr>
  `
}

const outputUser = (user, isAdmin = false, selector = '.users-tbody') => {
  const userRowHtml = createUserRow(user, isAdmin)
  $(selector).insertAdjacentHTML('beforeend', userRowHtml)
}

const outputPost = (post, selector = '.posts-tbody') => {
  const postRowHtml = createPostRow(post)
  $(selector).insertAdjacentHTML('beforeend', postRowHtml)
}

const createPagination = (page, totalPages) => {
  let paginationItem = ``
  if (+page > 1) {
    paginationItem += `<span class="pagination-label pagination-label--prev">&laquo;</span>`
  }
  for (let i = 1; i <= totalPages; i++) {
    paginationItem += `<span class="pagination-label ${
      +page == i ? 'active' : ''
    }">${i}</span>`
  }
  if (+page < totalPages) {
    paginationItem += `<span class="pagination-label pagination-label--next">&raquo;</span>`
  }
  return `
    <div class="pagination">
      ${paginationItem}
    </div>
  `
}

const getUsers = async () => {
  let page = 1
  let limit = limitUsers
  let sortBy = 'createdAt:desc'
  let data = await httpGet(
    `/users?page=${page}&limit=${limit}&sortBy=${sortBy}`
  )
  if (data.totalUsers < 1) {
    let html = `
      <tr>
        <td class="text-center" colspan="12">Nothing to show.</td>
      </tr>
    `
    $('.users-tbody').innerHTML = html
    return
  }

  data.users.forEach(user => outputUser(user))
  if (data.page < data.totalPages) {
    $('.users_table tfoot td').innerHTML = createPagination(
      data.page,
      data.totalPages
    )
  }

  $('.users_table tfoot td').onclick = async e => {
    const pagiLabel = e.target.closest('.pagination-label')
    if (pagiLabel) {
      let isPagiActive = pagiLabel.classList.contains('active')
      let isPagiPrev = pagiLabel.classList.contains('pagination-label--prev')
      let isPagiNext = pagiLabel.classList.contains('pagination-label--next')
      const currentPage =
        pagiLabel.parentElement.querySelector('.active').innerText

      if (isPagiActive) return
      page = pagiLabel.innerText
      if (isPagiPrev) {
        page = +currentPage - 1
      }
      if (isPagiNext) {
        page = +currentPage + 1
      }
      data = await httpGet(
        `/users?page=${page}&limit=${limit}&sortBy=${sortBy}`
      )
      $('.users-tbody').innerHTML = ''
      data.users.forEach(user => outputUser(user))
      $('.users_table tfoot td').innerHTML = createPagination(
        data.page,
        data.totalPages
      )
    }
  }
}
getUsers()

const getManagers = async () => {
  let page = 1
  let limit = limitAdmin
  let sortBy = 'createdAt:desc'
  let data = await httpGet(
    `/users?page=${page}&limit=${limit}&sortBy=${sortBy}&role=admin`
  )
  if (data.totalUsers < 1) {
    let html = `
      <tr>
        <td class="text-center" colspan="12">Nothing to show.</td>
      </tr>
    `
    $('.managers-tbody').innerHTML = html
    return
  }

  data.users.forEach(user => outputUser(user, true, '.managers-tbody'))
  if (data.page < data.totalPages) {
    $('.managers_table tfoot td').innerHTML = createPagination(
      data.page,
      data.totalPages
    )
  }

  $('.managers_table tfoot td').onclick = async e => {
    const pagiLabel = e.target.closest('.pagination-label')
    if (pagiLabel) {
      let isPagiActive = pagiLabel.classList.contains('active')
      let isPagiPrev = pagiLabel.classList.contains('pagination-label--prev')
      let isPagiNext = pagiLabel.classList.contains('pagination-label--next')
      const currentPage =
        pagiLabel.parentElement.querySelector('.active').innerText

      if (isPagiActive) return
      page = pagiLabel.innerText
      if (isPagiPrev) {
        page = +currentPage - 1
      }
      if (isPagiNext) {
        page = +currentPage + 1
      }
      data = await httpGet(
        `/users?page=${page}&limit=${limit}&sortBy=${sortBy}&role=admin`
      )
      $('.managers-tbody').innerHTML = ''
      data.users.forEach(user => outputUser(user, true, '.managers-tbody'))
      $('.managers_table tfoot td').innerHTML = createPagination(
        data.page,
        data.totalPages
      )
    }
  }
}
getManagers()

const getPosts = async () => {
  let page = 1
  let limit = limitPosts
  let sortBy = ''
  let data = await httpGet(
    `/posts/sort?page=${page}&limit=${limit}&sortBy=${sortBy}`
  )
  if (data.totalPosts < 1) {
    let html = `
    <tr>
      <td class="text-center" colspan="5">Nothing to show.</td>
    </tr>
    `
    $('.posts-tbody').innerHTML = html
    return
  }
  data.posts.forEach(post => outputPost(post))
  if (data.page < data.totalPages) {
    $('.posts_table tfoot td').innerHTML = createPagination(
      data.page,
      data.totalPages
    )
  }

  $('.posts_table tfoot td').onclick = async e => {
    const pagiLabel = e.target.closest('.pagination-label')
    if (pagiLabel) {
      let isPagiActive = pagiLabel.classList.contains('active')
      let isPagiPrev = pagiLabel.classList.contains('pagination-label--prev')
      let isPagiNext = pagiLabel.classList.contains('pagination-label--next')
      const currentPage =
        pagiLabel.parentElement.querySelector('.active').innerText

      if (isPagiActive) return
      page = pagiLabel.innerText
      if (isPagiPrev) {
        page = +currentPage - 1
      }
      if (isPagiNext) {
        page = +currentPage + 1
      }
      data = await httpGet(
        `/posts/sort?page=${page}&limit=${limit}&sortBy=${sortBy}`
      )
      $('.posts-tbody').innerHTML = ''
      data.posts.forEach(post => outputPost(post))
      $('.posts_table tfoot td').innerHTML = createPagination(
        data.page,
        data.totalPages
      )
    }
  }
}
getPosts()

// Delete post
const deletePost = async (postId, postContainer) => {
  const data = await httpDelete(`/posts/${postId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  postContainer.remove()
}
// Delete user
const deleteUser = async (userId, userContainer) => {
  const data = await httpDelete(`/users/${userId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  userContainer.remove()
}
// Delete user
const resetPassword = async userId => {
  const data = await httpPatch(`/users/reset_password/${userId}`, {
    password: 'abc.12345',
  })
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}
// Update user
const updateUser = async (userId, body) => {
  const data = await httpPatch(`/users/${userId}`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}
// Delete user
const deleteManager = async (userId, userContainer) => {
  const data = await httpDelete(`/users/${userId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  userContainer.remove()
}
// Update user
const updateManager = async (userId, body) => {
  const data = await httpPatch(`/users/${userId}`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}
// Create new user
// Update user
const createNewUser = async body => {
  const data = await httpPost(`/users/`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}
// Create modal update User
const modalBodyUpdateUser = user => {
  let roles = ['user', 'admin']
  return `
    <div class="col-12 grid-margin stretch-card">
      <div class="card">
          <div class="card-body">
              <form class="form-update-user">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input class="form-control text-primary bg-dark" autofocus type="text" disabled value=${
                      user.email
                    } />
                  </div>
                  <div class="form-group">
                    <label>Role</label>
                    <select class="form-select bg-dark form-select-sm text-white" name="role">
                      <option selected>${user.role}</option>
                      ${roles
                        .map(role => {
                          return (
                            role !== user.role &&
                            `<option value="${role}">${role}</option>`
                          )
                        })
                        .join(',')}
                    </select>
                  </div>
              </form>
          </div>
      </div>
    </div>
  `
}
// Create modal create User
const modalBodyCreateUser = () => {
  return `
    <div class="col-12 grid-margin stretch-card">
      <div class="card">
          <div class="card-body">
              <form class="form-update-user">
                  <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input class="form-control text-primary required bg-dark" autofocus type="text" name="firstName"/>
                  </div>

                   <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input class="form-control text-primary required bg-dark" type="text" name="lastName"/>
                  </div>

                  <div class="form-group">
                    <label for="email">Email</label>
                    <input class="form-control text-primary required bg-dark" type="email" name="email"/>
                  </div>

                  <div class="form-group">
                    <label for="email">Password</label>
                    <input class="form-control text-primary required bg-dark" type="text" value="abc.12345" name="password"/>
                  </div>

                  <div class="form-group">
                    <label>Role</label>
                    <select class="form-select bg-dark form-select-sm text-white" name="role">
                      <option selected>user</option>
                      <option>admin</option>
                    </select>
                  </div>

              </form>
          </div>
      </div>
    </div>
  `
}
// Handle post
const handlePostTable = async () => {
  let post = null
  let postContainer = null
  $('.posts_table').onclick = async e => {
    postContainer = e.target.closest('.post_row')
    if (postContainer) {
      post = JSON.parse(postContainer.dataset.post)
    }

    if (e.target.closest('.btn-delete-post')) {
      let modalTitle = $('#deletePostModal').querySelector('.modal-title')
      let modalBody = $('#deletePostModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa bài viết của <span class="text-white">${
        post.postedBy.firstName + post.postedBy.lastName
      }</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa bài viết có nội dung: <span class="text-info">${`${post.content} ...`}</span>. ra khỏi hệ thống?</span>`
    }
  }

  $('#deletePostModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeletePost'))
        return deletePost(post.id, postContainer)
    }
  })
}
// verify email
const verifyEmail = async (userId, isActive) => {
  const data = await httpPatch(`/users/active_account/${userId}`, {})
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}
// handle user
const handleUserTable = async () => {
  let user = null
  let userContainer = null
  let isActive = false
  $('.users_table').onclick = async e => {
    userContainer = e.target.closest('.user_row')
    if (userContainer) {
      user = JSON.parse(userContainer.dataset.user)
    }

    if (e.target.closest('.btn-delete-user')) {
      let modalTitle = $('#deleteUserModal').querySelector('.modal-title')
      let modalBody = $('#deleteUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa tài khoản <span class="text-white">${user.email}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa tài khoản và bài viết của <span class="fw-bold text-info">${
        user.firstName + user.lastName
      }</span> ra khỏi hệ thống?</span>`
    }
    if (e.target.closest('.btn-update-user')) {
      let modalTitle = $('#updateUserModal').querySelector('.modal-title')
      let modalBody = $('#updateUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Cấp quyền cho <span class="text-white">${
        user.firstName + user.lastName
      }</span> ?`
      modalBody.innerHTML = modalBodyUpdateUser(user)
    }
    if (e.target.closest('.btn-reset-password')) {
      let modalTitle = $('#resetPasswordModal').querySelector('.modal-title')
      let modalBody = $('#resetPasswordModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa tài khoản <span class="text-white">${user.email}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">
            Reset Password cho tài khoản
            <span class="fw-bold text-info">${
              user.firstName + user.lastName
            }</span> ?
          </span>`
    }
    if (e.target.closest('.btn-verify-email')) {
      isActive = e.target.dataset.type === 'block' ? false : true
      let modalTitle = $('#verifyEmailModal').querySelector('.modal-title')
      let modalBody = $('#verifyEmailModal').querySelector('.modal-body')
      modalTitle.innerHTML = `${
        isActive ? 'Active' : 'Block'
      } tài khoản <span class="text-white">${user.email}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">${
        isActive ? 'Mở' : 'Đóng'
      } tài khoản <span class="fw-bold text-info">${
        user.firstName + user.lastName
      }</span> ? </span>`
    }
  }

  $('#deleteUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeleteUser'))
        return deleteUser(user.id, userContainer)
    }
  })

  $('#updateUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitUpdateUser')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return updateUser(user.id, body)
      }
    }
  })

  $('#resetPasswordModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitResetPassword')) {
        return resetPassword(user.id)
      }
    }
  })
  $('#verifyEmailModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitVerifyEmail')) {
        return verifyEmail(user.id, isActive)
      }
    }
  })
}
// handle manager
const handleManagersTable = async () => {
  let user = null
  let userContainer = null
  $('.managers_table').onclick = async e => {
    userContainer = e.target.closest('.user_row')
    if (userContainer) {
      user = JSON.parse(userContainer.dataset.user)
    }

    if (e.target.closest('.btn-delete-manager')) {
      let modalTitle = $('#deleteUserModal').querySelector('.modal-title')
      let modalBody = $('#deleteUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa tài khoản <span class="text-white">${user.email}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa thành viên <span class="fw-bold text-info">${
        user.firstName + user.lastName
      }</span> ra khỏi hệ thống?</span>`
    }

    if (e.target.closest('.btn-update-manager')) {
      let modalTitle = $('#createManagerModal').querySelector('.modal-title')
      let modalBody = $('#createManagerModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Sửa quyền của <span class="text-white">${
        user.firstName + user.lastName
      }</span> ?`
      modalBody.innerHTML = modalBodyUpdateUser(user)
    }
  }

  $('#deleteManagerModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeleteManager'))
        return deleteManager(user.id, userContainer)
    }
  })

  $('#createManagerModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitCreateManager')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return updateManager(user.id, body)
      }
    }
  })
}
// handle create new user
const handleNewUser = async () => {
  $('.btn-create-user').onclick = () => {
    let modalTitle = $('#createNewUserModal').querySelector('.modal-title')
    let modalBody = $('#createNewUserModal').querySelector('.modal-body')
    modalTitle.innerHTML = `Tạo một tài khoản mới ?`
    modalBody.innerHTML = modalBodyCreateUser()
  }
  $('#createNewUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitCreateNewUser')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return createNewUser(body)
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  handlePostTable()
  handleUserTable()
  handleManagersTable()
  handleNewUser()
})
