import * as httpRequest from '../../utils/httpRequest';

export const getProductColorsByColorId = async (colorId) => {
  try {
    const response = await httpRequest.get(`/glass-colors/${colorId}`);
    console.log('Colors of product:', response);
    return response; // { data: [...], colors: [...] }
  } catch (error) {
    console.error('Get product colors error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
