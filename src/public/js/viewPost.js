outputPost(post)
if (replies.length > 0) {
  replies.forEach(post => outputPost(post, '.posts', 'beforeend'))
}
