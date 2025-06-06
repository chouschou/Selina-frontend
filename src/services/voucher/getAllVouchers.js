import * as httpRequest from '../../utils/httpRequest';

export const getAllVouchers = async () => {
  try {
    const response = await httpRequest.get(`/vouchers`);
    console.log('getAllVouchers:', response);
    return response;
  } catch (error) {
    console.error('Get all vouchers error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Something went wrong';
  }
};