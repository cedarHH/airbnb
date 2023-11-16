import axios from 'axios';
import configs from '../../config.json';

const API_URL = `http://localhost:${configs.BACKEND_PORT}/user/auth/`;

const register = async (email, password, name) => {
  return axios.post(`${API_URL}register`, {
    email,
    password,
    name
  });
};

const login = async (email, password) => {
  return axios.post(`${API_URL}login`, {
    email,
    password
  });
};

const logout = async (token) => {
  return axios.post(`${API_URL}logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default {
  register,
  login,
  logout
};
