import axios from 'axios';
import { getAccessToken, isAccessTokenValid } from './cookieUtils';

const api = axios.create({ baseURL: 'http://localhost:3000' });

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();

  if (token && !isAccessTokenValid()) {
    // Token hết hạn, gọi /auth/refresh-token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const res = await axios.post('http://localhost:3000/auth/refresh-token', {
          refreshToken,
        });
        const newAccessToken = res.data.access_token;
        localStorage.setItem('accessToken', newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (err) {
        console.error('Refresh token failed', err);
        // Redirect về login nếu muốn
      }
    }
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
