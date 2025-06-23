import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

export const changeUserPassword = async (data) => {
  try {
    const response = await api.patch(`/accounts/change-own-password`, data,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('changeUserPassword response:', response);
    return response;
  } catch (error) {
    console.error(
      'changeUserPassword error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
