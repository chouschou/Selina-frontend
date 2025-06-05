import * as httpRequest from '../../utils/httpRequest';

export const getProductById = async (productId) => {
  try {
    const response = await httpRequest.get(`/products/${productId}`);
    console.log('infor product:', response);
    return response;
  } catch (error) {
    console.error('Get product error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
