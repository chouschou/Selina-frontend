// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const checkDeliveryUsed = async (idAccountDelivery) => {
  try {
    const response = await api.get(`/account-delivery/${idAccountDelivery}/check-used-in-order`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('check account delivery used response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'check account delivery used error:',
      error.response || error.message
    );
    throw error.response || 'Something went wrong';
  }
};

