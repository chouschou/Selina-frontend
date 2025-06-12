// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const addVoucher = async (data) => {
  try {
    const response = await api.post('/vouchers', data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('Add voucher response:', response);
    return response;
  } catch (error) {
    console.error(
      'Add voucher error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

