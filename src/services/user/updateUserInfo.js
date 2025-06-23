import { getAccessToken } from "../../utils/cookieUtils";
// import * as httpRequest from "../../utils/httpRequest";
import api from '../../utils/axiosInterceptors';

export const updateUserInfo = async (id, formdata) => {
  try {
    const response = await api.patch(`/accounts/${id}/customer`, formdata, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("getAccountInfoByID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error?.message);
    throw error?.message || "Something went wrong";
  }
};