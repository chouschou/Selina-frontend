import * as httpRequest from '../../utils/httpRequest'

export const getProductsByCategory = async (category) => {
  try {
    const response = await httpRequest.get(`/products/by-category/${encodeURIComponent(category)}`);
    console.log('Products by category:', response);
    return response;
  } catch (error) {
    console.error('Get products by category error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

