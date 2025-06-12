import * as httpRequest from '../../utils/httpRequest';

export const getAllShipFees = async () => {
  try {
    const response = await httpRequest.get(`/shipping-fee`);
    console.log('all ship fee:', response);
    return response;
  } catch (error) {
    console.error('get all ship fee error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
