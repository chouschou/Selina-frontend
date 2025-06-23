import * as httpRequest from '../../utils/httpRequest'

export const forgotPassword = async (email) => {
  try {
    const response = await httpRequest.post('/auth/forgot-password', {
      email: email,
    })
    console.log('forgot-password response:', response)
    return response
  } catch (error) {
    console.log('forgot-password error response:', error.response.data.message)
    throw error.response.data.message
  }
}