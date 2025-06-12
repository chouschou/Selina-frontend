import api from "../../utils/axiosInterceptors";
// import * as httpRequest from '../../utils/httpRequest'
import { getAccessToken } from "../../utils/cookieUtils";

export const updateVoucher = async (id, data) => {
  try {
    const response = await api.put(`/vouchers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("Update voucher response:", response);
    return response;
  } catch (error) {
    console.error("Update voucher error:", error.response?.data);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
