import { jwtDecode } from 'jwt-decode'

export const getCookieValue = (cookieName) => {
  const cookieArray = document.cookie.split('; ')
  const cookie = cookieArray.find((c) => c.trim().startsWith(`${cookieName}`))
  return cookie ? cookie.split('=')[1] : null
}

export const isAccessTokenValid = () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return false

    const { exp } = jwtDecode(accessToken)
    return exp >= Math.floor(Date.now() / 1000)
  } catch (error) {
    return error
  }
}

export const getAccessToken = () => {
  // return getCookieValue('access_token')
  return localStorage.getItem('accessToken')
}