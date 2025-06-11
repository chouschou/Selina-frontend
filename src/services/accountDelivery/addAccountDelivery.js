// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const addAccountDelivery = async (data) => {
  try {
    const response = await api.post('/account-delivery', data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('Add account delivery response:', response);
    return response;
  } catch (error) {
    console.error(
      'Add account delivery error:',
      error.response || error.message
    );
    throw error.response || 'Something went wrong';
  }
};

