// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const updateStatusRefund = async (idOrder, data) => {
  try {
    const response = await api.patch(`/orders/${idOrder}/refund`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('update status refund response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'update status refund error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
