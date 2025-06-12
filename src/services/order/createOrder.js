// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const createOrder = async (data) => {
  try {
    const response = await api.post('/orders', data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('create order response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'create order error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

