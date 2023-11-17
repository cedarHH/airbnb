import axios from 'axios';
import configs from '../../config.json';

const API_URL = `http://localhost:${configs.BACKEND_PORT}/bookings`;

const getBookings = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(API_URL, config);
};
const createBooking = async (listingId, data) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.post(`${API_URL}/new/${listingId}`, data, config);
};

const acceptBooking = async (listingId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.put(`${API_URL}/accept/${listingId}`, null, config);
};
const declineBooking = async (listingId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.put(`${API_URL}/decline/${listingId}`, null, config);
};
const deleteBooking = async (listingId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.delete(`${API_URL}/${listingId}`, config);
};

export default {
  getBookings,
  createBooking,
  acceptBooking,
  declineBooking,
  deleteBooking
}
