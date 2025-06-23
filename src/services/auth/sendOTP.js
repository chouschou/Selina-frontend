import * as httpRequest from '../../utils/httpRequest'

export const sendOTP = async (email) => {
  try {
    const response = await httpRequest.post('/auth/send-otp', {
      email: email,
    })
    console.log('sendOTP response:', response)
    return response
  } catch (error) {
    console.log('sendOTP error response:', error.response.data.message)
    throw error.response.data.message
  }
}