import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (error) => {
    return Promise.reject(error.response?.data || { message: 'Loi ket noi server' });
  }
);

export default axiosClient;
