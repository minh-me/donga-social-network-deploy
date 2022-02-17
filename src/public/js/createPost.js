// Check file when upload
let checkFileUpload = fileData => {
  let types = ['image/ipg', 'image/png', 'image/jpeg']
  let limit = 1048576 //byte = 1MB

  if (!types.includes(fileData.type)) {
    alertifyError('Kiểu file không hợp lệ, chỉ chấp nhận ảnh png, jpg và jpeg')
    return false
  }

  if (fileData.size > limit) {
    alertifyError(`Ảnh upload tối đa cho phép là ${limit}`)
    return false
  }

  return true
}

// preivew post image
const previewPostImage = (input, selector) => {
  if (input.files && input.files[0]) {
    let reader = new FileReader()
    if (!checkFileUpload(input.files[0])) return (input.value = '')
    reader.onload = e => {
      // render image to element
      let imagePreviewContainer = $(selector)
      imagePreviewContainer.innerHTML = ''

      let image = document.createElement('img')
      image.src = e.target.result
      imagePreviewContainer.appendChild(image)
    }
    // preview
    reader.readAsDataURL(input.files[0])
  }
}
// Upload post to server
const uploadPost = async formData => {
  try {
    const response = await fetch('/posts', {
      method: 'POST',
      body: formData,
    })
    const { post } = await response.json()
    // badrequest
    if (!response.ok) throw new Error(result.message)

    $('#createPostFormModal').querySelector('.button-close').click()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `<span>Đăng bài thành công.</span>`,
      showConfirmButton: false,
      timer: 800,
      background: '#15202b',
    })

    // success
    outputPost(post)

    if ($('.posts-empty')) $('.posts-empty').remove()
  } catch (error) {
    alertify.notify(error.message, 'error', 6)
  }
}
$('#createPostFormModal').addEventListener('show.bs.modal', event => {
  let modalFormHeader = event.target.querySelector('.post-form__header')
  modalFormHeader.innerHTML = `
    <div class="user_image-container d-flex">
      <img src="${userLoggedIn.profilePic}" alt="User's profile picture" />
    </div>
    <div class="user-post__container">
      <span class="displayName">${userLoggedIn.fullName} </span>
      <span class="username">@${userLoggedIn.username}</span>
    </div> 
  `

  let content = ''
  let postImage = ''
  $('#buttonPostFormModal').setAttribute('disabled', true)

  // image
  $('#postImage').onchange = e => {
    previewPostImage(e.target, '.postImage-preview__container')
    postImage = e.target.files[0]
  }
  // Text area
  $('#postTextarea').onkeydown = e => {
    let buttonSubmit = event.target.querySelector('#submitCreatePost')
    // check value
    if (e.target.value.length < 5) {
      buttonSubmit.setAttribute('disabled', true)
      return
    }
    content = e.target.value
    buttonSubmit.removeAttribute('disabled')

    if (content.length > 6 && e.which === 13) {
      let formData = new FormData()
      if (postImage) formData.append('postImage', postImage)
      if (content) formData.append('content', content)
      uploadPost(formData)
    }
  }

  // submit
  $('#submitCreatePost').onclick = e => {
    let formData = new FormData()
    if (postImage) formData.append('postImage', postImage)
    if (content) formData.append('content', content)
    uploadPost(formData)
  }
})

$('#createPostFormModal').addEventListener('hide.bs.modal', () => {
  $('#postTextarea').value = ''
  $('#postImage').value = ''
  $('.postImage-preview__container').innerHTML = ''
  $('#buttonPostFormModal').removeAttribute('disabled')
})
