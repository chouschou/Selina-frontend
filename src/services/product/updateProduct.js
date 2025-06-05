// import * as httpRequest from '../../utils/httpRequest';
import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

export const updateProduct = async (productId, formData) => {
  try {
    const response = await api.post(`/products/${productId}`, formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update product response:', response);
    return response;
  } catch (error) {
    console.error(
      'Update product error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
