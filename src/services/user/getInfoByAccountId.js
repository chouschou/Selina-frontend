import { getAccessToken } from "../../utils/cookieUtils";
// import * as httpRequest from "../../utils/httpRequest";
import api from '../../utils/axiosInterceptors';

export const getAccountInfoByID = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("getAccountInfoByID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error?.message);
    throw error?.message || "Something went wrong";
  }
};
