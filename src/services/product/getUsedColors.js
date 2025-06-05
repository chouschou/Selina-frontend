import * as httpRequest from '../../utils/httpRequest';

export const getUsedColors = async (productId) => {
  try {
    const response = await httpRequest.get(`/products/${productId}/used-colors`);
    console.log('getUsedColors:', response.usedColors);
    return response.usedColors;
  } catch (error) {
    console.error('Get product error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
