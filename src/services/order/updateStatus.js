// import * as httpRequest from '../../utils/httpRequest'
import api from "../../utils/axiosInterceptors";
import { getAccessToken } from "../../utils/cookieUtils";

export const updateStatus = async (idOrder, data) => {
  try {
    const response = await api.patch(`/orders/${idOrder}/status`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("update status response:", response);
    return response;
  } catch (error) {
    console.error("update status error full:", error); 
    throw error.response?.data?.message || "Something went wrong";
  }
};
