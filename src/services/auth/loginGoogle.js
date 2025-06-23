import * as httpRequest from '../../utils/httpRequest'

export const loginGoogle = async (token) => {
  try {
    const response = await httpRequest.post('/auth/google-login', {
      token: token,
    })
     console.log('Full login google response:', response);
    return response
  } catch (error) {
    console.log('Login google error response:', error.response.data.message)
    throw error.response.data.message
  }
}