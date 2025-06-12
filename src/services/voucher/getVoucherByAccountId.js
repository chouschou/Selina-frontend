import api from "../../utils/axiosInterceptors";
// import * as httpRequest from '../../utils/httpRequest'
import { getAccessToken } from "../../utils/cookieUtils";

export const getVoucherByAccountId = async (idAccount) => {
  try {
    const response = await api.get(`/vouchers/account/${idAccount}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("get voucher by id account response:", response);
    return response;
  } catch (error) {
    console.error("get voucher by id account error:", error.response?.data);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
