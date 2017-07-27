import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://dev.signaling.grymer.se'
});

export default instance;