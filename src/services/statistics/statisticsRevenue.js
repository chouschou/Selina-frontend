import api from "../../utils/axiosInterceptors";
import { getAccessToken } from "../../utils/cookieUtils";
const authHeader = {
  Authorization: `Bearer ${getAccessToken()}`
};
export const getStatisticsRevenue = async (statisticsBy, time) => {
  try {
    const response = await api.get('/statistics/revenue', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsRevenue error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
