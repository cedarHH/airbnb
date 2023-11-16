import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import listingService from './listingService';
import { useNavigate } from 'react-router';

function CreateListing () {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    thumbnail: '',
    propertyType: '',
    numberOfBeds: '',
    numberOfBathrooms: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullData = {
      title: formData.title,
      price: formData.price,
      thumbnail: formData.thumbnail,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      metadata: {
        propertyType: formData.propertyType,
        numberOfBeds: formData.numberOfBeds,
        numberOfBathrooms: formData.numberOfBathrooms,
        reviews: []
      }
    };
    try {
      const response = await listingService.createListing(fullData);
      alert('Listing created:' + response.data.listingId);
      navigate('/hosted-listings')
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1 }, maxWidth: 500, mx: 'auto' }}>
      <TextField
        name="title"
        label="Listing Title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="price"
        label="Price (per night)"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        type="number"
      />
      <TextField
        name="thumbnail"
        label="Thumbnail URL"
        value={formData.thumbnail}
        onChange={handleChange}
        fullWidth
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel>Property Type</InputLabel>
        <Select
          name="propertyType"
          value={formData.propertyType}
          label="Property Type"
          onChange={handleChange}
        >
          <MenuItem value="Villa">Villa</MenuItem>
          <MenuItem value="Apartment">Apartment</MenuItem>
          {/* 可以添加更多的物业类型 */}
        </Select>
      </FormControl>
      <TextField
        name="street"
        label="Street Address"
        value={formData.street}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="city"
        label="City"
        value={formData.city}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="state"
        label="State"
        value={formData.state}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="zipCode"
        label="Zip Code"
        value={formData.zipCode}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="numberOfBeds"
        label="Number of Beds"
        value={formData.numberOfBeds}
        onChange={handleChange}
        fullWidth
        type="number"
      />
      <TextField
        name="numberOfBathrooms"
        label="Number of Bathrooms"
        value={formData.numberOfBathrooms}
        onChange={handleChange}
        fullWidth
        type="number"
      />
      {}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Listing</Button>
    </Box>
  );
}

export default CreateListing;
