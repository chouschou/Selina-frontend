// import * as httpRequest from '../../utils/httpRequest'
import api from '../utils/axiosInterceptors';
import { getAccessToken } from '../utils/cookieUtils'

export const predictFaceAndGender = async (data) => {
  try {
    const response = await api.post('/ai/predict', data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('predictFaceAndGender response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'predictFaceAndGender error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Something went wrong';
  }
};

