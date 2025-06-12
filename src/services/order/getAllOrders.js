// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('get all orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'get all orders error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
