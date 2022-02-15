import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('zennomi-token');
  config.headers['x-access-token'] = token ? token : '';
  return config;
}
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response);
    return Promise.reject((error.response && error.response.data && (error.response.data.message || error.response.data || error.response )) || 'Something went wrong')
  }
);

export default axiosInstance;