// import * as httpRequest from '../../utils/httpRequest'
import api from "../../utils/axiosInterceptors";
import { getAccessToken } from "../../utils/cookieUtils";

export const vnpayPayment = async (orderRes) => {
  try {
    const response = await api.get(
      `/orders/vnpay-url/${orderRes.ID}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      'VNPay error:',
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || 'Lỗi thanh toán VNPay';
  }
};


