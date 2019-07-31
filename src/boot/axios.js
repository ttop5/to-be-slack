import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.printf520.com:8080',
});

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
