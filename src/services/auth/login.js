import * as httpRequest from '../../utils/httpRequest'

export const login = async (email, password) => {
  try {
    const response = await httpRequest.post('/auth/login', {
      Username: email,
      Password: password,
    })
    console.log('Login response:', response)
    return response
  } catch (error) {
    console.log('Login error response:', error.response.data.message)
    throw error.response.data.message
  }
}