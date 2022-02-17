const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const flashMasterNotify = () => {
  let notify = $('.master-success-message span.message')
  if (notify) {
    alertify.notify(notify.textContent, 'success', 5)
    notify.parentElement.remove()
  }
}

$('.logout').onclick = e => {
  e.preventDefault()
  Swal.fire({
    title: `Đăng xuất tài khoản?`,
    html: `Đăng xuất tài khoản <span class="text-primary"> ${userLoggedIn.fullName}</span>.`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Để sau',
    confirmButtonText: 'Có 😀',
    background: '#15202b',
  }).then(result => {
    if (result.isConfirmed) return (window.location.href = '/auth/logout')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  // Flash message ở màn hình master
  flashMasterNotify()
})
