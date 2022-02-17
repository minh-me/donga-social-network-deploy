let cropper
let uploadTypes = ['image/ipg', 'image/png', 'image/jpeg']
let uploadLimit = 3145728 //byte = 3B
// Check file when upload
let checkFileUpload = fileData => {
  let types = uploadTypes
  let limit = uploadLimit

  if (!types.includes(fileData.type)) {
    alertifyError('Kiểu file không hợp lệ, chỉ chấp nhận ảnh png, jpg và jpeg')
    return false
  }

  if (fileData.size > limit) {
    alertifyError(`Ảnh upload tối đa cho phép là ${limit / 1048576}`)
    return false
  }

  return true
}
const previewImage = (input, selector, namePreview, optionsCopper) => {
  if (input.files && input.files[0]) {
    let reader = new FileReader()
    if (!checkFileUpload(input.files[0])) return (input.value = '')
    reader.onload = e => {
      // render image to element
      let imagePreviewContainer = $(selector)
      imagePreviewContainer.innerHTML = ''

      let image = document.createElement('img')
      image.setAttribute('id', namePreview)
      image.src = e.target.result
      imagePreviewContainer.appendChild(image)
      cropper = new Cropper(image, optionsCopper)

      // prevent event zoom
      image.addEventListener('zoom', event => {
        event.preventDefault()
      })
    }

    // preview
    reader.readAsDataURL(input.files[0])
    input.value = ''
  }
}
const submitImage = (input, keyImage, api) => {
  let canvas = cropper.getCroppedCanvas()
  if (canvas == null) {
    alertifyError(
      'Không thể upload avatar, bạn chưa tải file hoặc kiểu file của bạn không hợp lệ.'
    )
  }
  input.value = ''
  canvas.toBlob(async blob => {
    // Send fileData to server
    let formData = new FormData()
    formData.append(keyImage, blob)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `<span>Đang tải...</span>`,
      showConfirmButton: false,
      timer: 5000,
      background: '#15202b',
    })
    const response = await fetch(api, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (!response.ok) {
      alertifyError(data.message)
      // remove cropper
      cropper.destroy()
    }

    // clear element
    return location.reload()
  })
}

// Preview avatar and cropper
$('#avatarPhoto').onchange = e => {
  previewImage(e.target, '.avatar-preview__container', 'avatarPreview', {
    aspectRatio: 16 / 16,
    background: false,
  })
}

// Preview cover and cropper
$('#coverPhoto').onchange = e =>
  previewImage(e.target, '.cover-preview__container', 'coverPreview', {
    aspectRatio: 16 / 9,
    background: false,
  })

// submit avatar photo file data to server
$('#submitAvatarPhoto').onclick = e => {
  submitImage($('#avatarPhoto'), 'coppedAvatar', '/uploads/avatarPhoto')
}

// submit cover photo file data to server
$('#submitCoverPhoto').onclick = e => {
  submitImage($('#coverPhoto'), 'coppedCoverPhoto', '/uploads/coverPhoto')
}

// Handle modal when close
$('#coverPhotoUploadModal').addEventListener('hide.bs.modal', e => {
  $('#coverPhoto').value = ''
  $('.cover-preview__container').innerHTML = ''
})

// Handle modal when close
$('#avatarUploadModal').addEventListener('hide.bs.modal', e => {
  $('#avatarPhoto').value = ''
  $('.avatar-preview__container').innerHTML = ''
})
