// import * as httpRequest from "../../utils/httpRequest";
import api from '../../utils/axiosInterceptors';

export const createUserInfo = async (id, formdata) => {
  try {
    const response = await api.post(`/accounts/${id}/customer`, formdata, {
      headers: {
        // Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("createUserInfo", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error?.message);
    throw error?.message || "Something went wrong";
  }
};