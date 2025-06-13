// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const createShipFee = async (data) => {
  try {
    const response = await api.post('/shipping-fee', data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('create ship fee response:', response);
    return response;
  } catch (error) {
    console.error(
      'create ship fee error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

