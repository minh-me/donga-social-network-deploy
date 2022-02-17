const httpGet = async url => {
  try {
    const response = await fetch(url)

    // success
    const result = await response.json()

    // badrequest
    if (!response.ok) throw new Error(result.message)

    return result
  } catch (error) {
    console.error({ httpGET: error })
    alertify.notify(error.message, 'error', 6)
  }
}

const httpPost = async (url, data) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  try {
    const response = await fetch(url, options)

    // success
    const result = await response.json()

    // badrequest
    if (!response.ok) throw new Error(result.message)

    return result
  } catch (error) {
    console.error({ httpPost: error })
    alertify.notify(error.message, 'error', 6)
  }
}

const httpPatch = async (url, data) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  try {
    const response = await fetch(url, options)
    // success
    const result = await response.json()
    // badrequest
    if (!response.ok) throw new Error(result.message)
    return result
  } catch (error) {
    console.error({ httpPatch: error })
    alertify.notify(error.message, 'error', 6)
  }
}

const httpDelete = async url => {
  try {
    const response = await fetch(url, { method: 'DELETE' })
    // success
    const result = await response.json()
    // badrequest
    if (!response.ok) throw new Error(result.message)
    return result
  } catch (error) {
    console.error({ httpDelete: error })
    alertify.notify(error.message, 'error', 6)
  }
}
