// import * as httpRequest from '../../utils/httpRequest'
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils'

export const addProduct = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Add product response:', response);
    return response;
  } catch (error) {
    console.error(
      'Add product error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

