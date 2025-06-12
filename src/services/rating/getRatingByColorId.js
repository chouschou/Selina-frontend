import * as httpRequest from '../../utils/httpRequest';

export const getRatingByColorId = async (id) => {
  try {
    const response = await httpRequest.get(`/ratings/glass-color/${id}`);
    return response;
  } catch (error) {
    console.error('Get rating by id color error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
