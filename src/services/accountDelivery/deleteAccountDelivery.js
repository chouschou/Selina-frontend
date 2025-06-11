// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const deleteAccountDelivery = async (idAccountDelivery) => {
  try {
    const response = await api.delete(`/account-delivery/${idAccountDelivery}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('delete account delivery response:', response);
    return response;
  } catch (error) {
    console.error(
      'delete account delivery error:',
      error.response || error.message
    );
    throw error.response || 'Something went wrong';
  }
};

