import * as httpRequest from '../../utils/httpRequest'

export const verifyOTP = async (email, otp) => {
  try {
    const response = await httpRequest.post('/auth/verify-otp', {
      email: email,
      otp: otp
    })
    console.log('verifyOTP response:', response)
    return response
  } catch (error) {
    console.log('verifyOTP error response:', error.response.data.message)
    throw error.response.data.message
  }
}