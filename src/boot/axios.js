import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.tophub.fun:8080',
});

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
