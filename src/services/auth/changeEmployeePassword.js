import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

export const changeEmployeePassword = async (data) => {
  try {
    const response = await api.patch(`/accounts/change-employee-password`, data,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('changeEmployeePasswordt response:', response);
    return response;
  } catch (error) {
    console.error(
      'changeEmployeePassword error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
