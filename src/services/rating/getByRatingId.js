import * as httpRequest from '../../utils/httpRequest'

export const getRatingById = async (ratingId) => {
  try {
    const response = await httpRequest.get(`/ratings/${ratingId}`)
    console.log('get rating by id :', response)
    return response
  } catch (error) {
    console.error('get rating by id error:', error.response?.data?.message || error.message)
    throw error.response?.data?.message || 'Something went wrong'
  }
}