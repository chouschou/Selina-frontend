import { getAccessToken } from "../../utils/cookieUtils";
// import * as httpRequest from "../../utils/httpRequest";
import api from '../../utils/axiosInterceptors';

export const addRating = async (idOrderDetail, formdata) => {
  try {
    const response = await api.post(`/ratings/${idOrderDetail}`, formdata, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("add rating", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error?.message);
    throw error?.message || "Something went wrong";
  }
};