import * as httpRequest from '../../utils/httpRequest';

export const getOrderCountByColorId = async (id) => {
  try {
    const response = await httpRequest.get(`/products/glass-colors/${id}/order-count`);
    return response;
  } catch (error) {
    console.error('Get order count error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
