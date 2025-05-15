import * as httpRequest from '../../utils/httpRequest';

export const getProductColorsById = async (productId) => {
  try {
    const response = await httpRequest.get(`/products/${productId}/colors`);
    console.log('Colors of product:', response);
    return response; // { data: [...], colors: [...] }
  } catch (error) {
    console.error('Get product colors error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
