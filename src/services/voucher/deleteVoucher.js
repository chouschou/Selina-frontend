import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

export const deleteVoucher = async (id) => {
  try {
    const response = await api.delete(`/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log('Delete voucher response:', response);
    return response;
  } catch (error) {
    console.error("Delete voucher error:", error.response?.data);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
