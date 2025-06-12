// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const updateAccountDelivery = async (accountDeliveryID, data) => {
  try {
    const response = await api.put(`/account-delivery/${accountDeliveryID}`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('update account delivery response:', response);
    return response;
  } catch (error) {
    console.error(
      'Add account delivery error:',
      error.response || error.message
    );
    throw error.response || 'Something went wrong';
  }
};

