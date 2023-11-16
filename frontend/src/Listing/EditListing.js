import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import listingService from './listingService';

function EditListing () {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    thumbnail: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: '',
    numberOfBeds: '',
    numberOfBathrooms: '',
    metadata: {
      propertyType: '',
      numberOfBeds: '',
      numberOfBathrooms: '',
      reviews: []
    }

  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListingDetail(id);
        const listing = response.data.listing;
        setFormData({
          title: listing.title,
          price: listing.price,
          thumbnail: listing.thumbnail,
          propertyType: listing.metadata.propertyType,
          numberOfBeds: listing.metadata.numberOfBeds,
          numberOfBathrooms: listing.metadata.numberOfBathrooms,
          street: listing.address.street,
          city: listing.address.city,
          state: listing.address.state,
          zipCode: listing.address.zipCode,
          metadata: listing.metadata

        });
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metadata = formData.metadata;
    metadata.numberOfBeds = formData.numberOfBeds;
    metadata.numberOfBathrooms = formData.numberOfBathrooms;
    metadata.propertyType = formData.propertyType;

    const updatedData = {
      title: formData.title,
      price: formData.price,
      thumbnail: formData.thumbnail,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      metadata: metadata

    };

    try {
      const response = await listingService.updateListing(id, updatedData);
      console.log('Listing updated:', response.data);

      navigate('/hosted-listings');
    } catch (error) {
      console.error('Error updating listing:', error);

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
          {}
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
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Update Listing</Button>
    </Box>
  );
}

export default EditListing;
