import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/glass-colors/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('Delete product response:', response);
    return response;
  } catch (error) {
    console.error(
      'Delete product error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};
