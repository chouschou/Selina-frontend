// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const deleteCart = async (idCart) => {
  try {
    const response = await api.delete(`/cart/${idCart}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('delete cart response:', response);
    return response;
  } catch (error) {
    console.error(
      'delete cart error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

