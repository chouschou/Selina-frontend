// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const updateQuantityCart = async (idCart, data) => {
  try {
    const response = await api.patch(`/cart/${idCart}`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('update quantity cart response:', response);
    return response;
  } catch (error) {
    console.error(
      'update quantity cart error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

