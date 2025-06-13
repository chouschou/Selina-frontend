// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const updateShipFee = async (id, data) => {
  try {
    const response = await api.put(`/shipping-fee/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('update ship fee response:', response);
    return response;
  } catch (error) {
    console.error(
      'update ship fee error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

