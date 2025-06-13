import axios from 'axios';

// Configura a URL base da nossa API
const API = axios.create({
  baseURL: 'http://localhost:3000/api/auth'
});

export default {
  login(credentials) {
    return API.post('/login', credentials);
  },
  
  register(userInfo) {
    return API.post('/register', userInfo);
  }
};
