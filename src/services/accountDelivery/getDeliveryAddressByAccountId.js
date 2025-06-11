// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const getDeliveryAddressByAccount = async (id) => {
  try {
    const response = await api.get(`/account-delivery/by-account/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('get delivery address response:', response);
    return response.data;
  } catch (error) {
    console.error(
      'get delivery address error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

