import { getAccessToken } from "../../utils/cookieUtils";
// import * as httpRequest from "../../utils/httpRequest";
import api from '../../utils/axiosInterceptors';

export const updateRating = async (idRating, formdata) => {
  try {
    const response = await api.put(`/ratings/${idRating}`, formdata, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    console.log("update rating", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error?.message);
    throw error?.message || "Something went wrong";
  }
};