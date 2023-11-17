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

const publishListing = async (listingId, availability) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.put(`${API_URL}/publish/${listingId}`, availability, config);
}
const unPublishListing = async (listingId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.put(`${API_URL}/unpublish/${listingId}`, null, config);
}

const reviewListing = async (listingId, bookingId, review) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const data = {
    review: {
      reviewer: review.reviewer,
      rating: review.rating,
      comment: review.comment
    }
  }
  return axios.put(`${API_URL}/${listingId}/review/${bookingId}`, data, config);
}

export default {
  getAllListing,
  getListingDetail,
  deleteListing,
  createListing,
  updateListing,
  publishListing,
  unPublishListing,
  reviewListing
};
