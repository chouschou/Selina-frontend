import * as httpRequest from '../../utils/httpRequest'

export const getProductsByShapes = async (shapes) => {
  try {
    const response = await httpRequest.post('/products/by-shapes', {
      shapes, // gửi mảng ["Vuông", "Tròn", ...]
    })
    console.log('Products by shape:', response)
    return response
  } catch (error) {
    console.error('Get products by shape error:', error.response?.data?.message || error.message)
    throw error.response?.data?.message || 'Something went wrong'
  }
}