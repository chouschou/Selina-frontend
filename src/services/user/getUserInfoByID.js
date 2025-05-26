import * as httpRequest from '../../utils/httpRequest'

export const getUserInfoByID = async (id, type) => {
  try {
    const response = await httpRequest.get(`user-info/${type}/${id}`);
    console.log('getUserInfoByID', response);
    return response;
  } catch (error) {
    console.error('Error:', error?.message);
    throw error?.message || 'Something went wrong';
  }
};
