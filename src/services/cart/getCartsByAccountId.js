// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const getCartsByAccountId = async () => {
  try {
    const response = await api.get('/cart', {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('get carts by account id response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'get carts by account id error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

