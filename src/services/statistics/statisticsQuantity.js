import api from '../../utils/axiosInterceptors';
import { getAccessToken } from '../../utils/cookieUtils';

const authHeader = {
  Authorization: `Bearer ${getAccessToken()}`
};

export const getStatisticsByShape = async (statisticsBy, time) => {
  console.log("getStatisticsByShape giá trị time:", time)
  try {
    const response = await api.get('/statistics/shape', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsByShape error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const getStatisticsByMaterial = async (statisticsBy, time) => {
  try {
    const response = await api.get('/statistics/material', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsByMaterial error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const getStatisticsByAge = async (statisticsBy, time) => {
  try {
    const response = await api.get('/statistics/age', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsByAge error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const getStatisticsByPrice = async (statisticsBy, time) => {
  try {
    const response = await api.get('/statistics/price', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsByPrice error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const getStatisticsByType = async (statisticsBy, time) => {
  try {
    const response = await api.get('/statistics/type', {
      headers: authHeader,
      params: { statisticsBy, time }
    });
    return response.data;
  } catch (error) {
    console.error('getStatisticsByPrice error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};
