// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const getDetailOrder = async (idOrder) => {
  try {
    const response = await api.get(`/orders/${idOrder}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('get detail order response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'get detail order error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
