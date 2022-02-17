document.addEventListener('DOMContentLoaded', async () => {
  // Realtime
  socket.emit('join-room', chatId)

  socket.on('typing', () =>
    $('.dot-typing__container').classList.remove('hidden')
  )
  socket.on('stop-typing', () =>
    $('.dot-typing__container').classList.add('hidden')
  )

  // Get chat name by chatId
  const { chat } = await httpGet(`/chats/${chatId}`)
  $('#chatName').innerHTML = getChatName(chat)
  scrollToBottom(false)
})

//-------------------- Rename chat --------------------
let chatIdUpdateName
$('#chatName').onclick = e => {
  chatIdUpdateName = e.target.dataset.id
  $('input#chatNameInput').value = e.target.innerHTML
}

let chatNameUpdate
$('input#chatNameInput').onchange = e => {
  chatNameUpdate = e.target.value
}

const updateChatName = async (chatIdUpdateName, chatNameUpdate) => {
  const { chatUpdated } = await httpPatch(`/chats/${chatIdUpdateName}`, {
    chatName: chatNameUpdate,
  })
  $('#chatName').innerHTML = chatUpdated.chatName
}

$('#createChatNameModal').addEventListener('shown.bs.modal', e => {
  e.target.onclick = async e => {
    if (e.target.closest('#submitChatNameButton')) {
      if (chatNameUpdate) {
        updateChatName(chatIdUpdateName, chatNameUpdate)
      }
    }
  }
})

$('#createChatNameModal').addEventListener('hide.bs.modal', e => {
  $('input#chatNameInput').value = $('#chatName').innerHTML
})
//-------------------- End rename chat --------------------

// ------------------- Message ---------------------
// ------------------- Get all messages ---------------------
;(async () => {
  const page = 1
  const limit = 50
  const sortBy = 'createdAt:desc'
  const select = ''

  const data = await httpGet(
    `/messages/content?chat=${chatId}&page=${page}&limit=${limit}&sortBy=${sortBy}&select=${select}`
  )

  if (data.messages.length < 1) {
    $('.messages').innerHTML = `
      <div class="sayhi">
        <img src="https://media1.giphy.com/media/LPehs7j0jKj48I0HeM/giphy.gif?cid=ecf05e478vdwqyop055dycxko107r6kdcj71vr5lh48wbt1j&rid=giphy.gif&ct=g" alt="" />
        <p >Vẫy tay chào</p>
      </div>`
    $('.lds-message').remove()
    $('.messages.hidden').classList.remove('hidden')
    return
  }
  data.messages.forEach(message =>
    addChatMessage(message, '.messages', 'afterbegin')
  )
  $('.lds-message').remove()
  $('.messages.hidden').classList.remove('hidden')
})()

// ------------------- Send message ---------------------
const sendMessage = async content => {
  const { message } = await httpPost('/messages/', {
    content: content,
    chat: chatId,
  })
  addChatMessage(message)

  // Socket message
  if (connected) {
    socket.emit('new-message', message)
  }
}

const messageSubmitted = () => {
  let content = $('textarea#inputTextBox').value.trim()

  sendMessage(content)

  $('textarea#inputTextBox').value = ''
  // Stop typing
  socket.emit('stop-typing', chatId)
  isTyping = false
}
let isTyping = false
let lastTypingTime
// Update typing with socket
const updateTyping = () => {
  if (!connected) return
  // add typing
  if (!isTyping) {
    isTyping = true
    socket.emit('typing', chatId)
  }

  // stop typing
  lastTypingTime = new Date().getTime()
  let timerLength = 3000
  setTimeout(() => {
    let timeNow = new Date().getTime()
    let timeDiff = timeNow - lastTypingTime
    if (timeDiff >= timeNow - lastTypingTime && isTyping) {
      socket.emit('stop-typing', chatId)
      isTyping = false
    }
  }, timerLength)
}

$('button.send-message__button').onclick = () => {
  messageSubmitted()
}
$('textarea#inputTextBox').onkeyup = e => {
  // Realtime typing
  updateTyping()

  let content = e.target.value.trim()

  if (!content) {
    $('button.send-message__button').setAttribute('disabled', true)
    return
  }
  if (e.keyCode === 13) {
    messageSubmitted()
  }

  $('button.send-message__button').removeAttribute('disabled')
}

// Upload image
let messageImageTypes = ['image/ipg', 'image/png', 'image/jpeg']
let messageImageLimit = 3145728 //byte = 3B
// Check file when upload
let checkFileUpload = fileData => {
  let types = messageImageTypes
  let limit = messageImageLimit

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

const uploadMessageImage = async formData => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>Đang tải ảnh lên...</span>`,
    showConfirmButton: false,
    timer: 2500,
    background: '#15202b',
  })

  const response = await fetch('/messages/', {
    method: 'POST',
    body: formData,
  })
  const result = await response.json()
  // badrequest
  if (!response.ok) throw new Error(result.message)
  // success
  addChatMessage(result.message)

  // Socket message
  if (connected) {
    socket.emit('new-message', message)
  }
}

$('#messageImage').onchange = e => {
  let input = e.target

  if (!checkFileUpload(input.files[0])) {
    input.value = ''
    return
  }

  let formData = new FormData()
  if (input.files[0]) formData.append('messageImage', input.files[0])
  formData.append('chat', chatId)
  uploadMessageImage(formData)
}
