import axios from 'axios';
import configs from '../../config.json';

const API_URL = `http://localhost:${configs.BACKEND_PORT}/listings`;

const getAllListing = async () => {
  return axios.get(`${API_URL}`);
};

const getListingDetail = async (listingId) => {
  return axios.get(`${API_URL}/${listingId}`);
};

const deleteListing = async (listingId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
const createListing = async (listingData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  return axios.post(`${API_URL}/new`, listingData, config);
};
const updateListing = async (listingId, listingData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  return axios.put(`${API_URL}/${listingId}`, listingData, config);
};

export default {
  getAllListing,
  getListingDetail,
  deleteListing,
  createListing,
  updateListing
};
