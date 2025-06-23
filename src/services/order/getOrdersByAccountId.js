import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const getOrdersByAccountId = async (id) => {
  try {
    const response = await api.get(`/orders/by-account/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('get all orders by account id response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'get all orders by account id error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
