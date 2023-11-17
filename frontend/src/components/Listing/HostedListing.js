import React, { useEffect, useState } from 'react';
import listingService from './listingService';
import Review from './Class/review';
import Listing from './Class/listing';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router';

function HostedListing () {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState();
  const [selectedListing, setSelectedListing] = useState(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const handleRatingClick = (listing) => {
    setSelectedListing(listing);
    setRatingDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAvailability([]);
  };

  const addAvailability = () => {
    setAvailability([...availability, { start: '', end: '' }]);
  };

  const removeAvailability = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const fetchData = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      console.log(userEmail);
      const response = await listingService.getAllListing();
      const listingsData = response.data.listings; 
      return await Promise.all(listingsData.filter(item => item.owner === userEmail).map(async (item) => {
        const detailResponse = await listingService.getListingDetail(item.id);
        const data = detailResponse.data.listing;
        const metadata = data.metadata;

        const reviews = data.reviews.map(review => new Review(review.reviewer, review.rating, review.comment));
        console.log(reviews)
        return new Listing(item.id, data.title, metadata.propertyType, metadata.numberOfBeds, metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published);
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData().then(setListings);
  }, []);
  const updateAvailability = (index, field, value) => {
    setAvailability(availability.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handlePublish = async (id) => {
    setId(id);
    setDialogOpen(true);
  }

  // eslint-disable-next-line no-unused-vars
  const calculateRatingDistribution = (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
      if (review.rating in distribution) {
        distribution[review.rating]++;
      }
    });

    const totalReviews = reviews.length;
    const percentages = Object.fromEntries(
      Object.entries(distribution).map(([rating, count]) => [rating, ((count / totalReviews) * 100).toFixed(2)])
    );

    return { counts: distribution, percentages };
  };

  const handleUnpublish = async (id) => {
    try {
      await listingService.unPublishListing(id);
      alert('Successful unpublish listing ', id);
      fetchData().then(setListings);
    } catch (error) {
      alert('Publish error!')
    }
  }
  const handleDelete = async (id) => {
    try {
      await listingService.deleteListing(id);
      alert('Successful delete listing ', id);
      fetchData().then(setListings);
    } catch (error) {
      alert('Delete error!');
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit-listings/${id}`);
  }
  const handleSave = async () => {
    try {
      await listingService.publishListing(id, { availability });
      alert('Successful publish listing ', id);
      fetchData().then(setListings);
    } catch (error) {
      alert('Publish error!');
    }

    handleDialogClose();
  };

  return (
    <Box m={3} p={1}>
      <TableContainer component={Paper}>
        <Table aria-label="listings table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="left">Property Type</TableCell>
              <TableCell align="left">Beds</TableCell>
              <TableCell align="left">Bathrooms</TableCell>
              <TableCell align="left">Thumbnail</TableCell>
              <TableCell align="left">Rating</TableCell>
              <TableCell align="left">Reviews</TableCell>
              <TableCell align="left">Price (per night)</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell component="th" scope="row">
                  {listing.title}
                </TableCell>
                <TableCell align="left">{listing.propertyType}</TableCell>
                <TableCell align="left">{listing.numberOfBeds}</TableCell>
                <TableCell align="left">{listing.numberOfBathrooms}</TableCell>
                <TableCell align="left">
                  <img src={listing.thumbnail} alt="Thumbnail" style={{ width: '50px' }}/>
                </TableCell>
                <TableCell align="left" onClick={(e) => { e.stopPropagation(); handleRatingClick(listing); }}>
                  <Rating value={listing.averageRating} precision={0.1} readOnly />
                </TableCell>
                <TableCell align="left">{listing.reviews.length}</TableCell>
                <TableCell align="left">${listing.pricePerNight}</TableCell>
                <TableCell align="left">
                  <Box display="flex">
                    <Button onClick={() => (navigate(`/hosted-detail/${listing.id}`))}>View</Button>
                    <Button onClick={() => (handleEdit(listing.id))}>Edit</Button>
                    <Button onClick={() => (handleDelete(listing.id))}>Delete</Button>
                    {
                      listing.published
                        ? (
                        <Button onClick={() => (handleUnpublish(listing.id))}>Unpublish</Button>
                          )
                        : (
                          <Button onClick={() => (handlePublish(listing.id))}>Publish</Button>
                          )
                    }
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <Button component={RouterLink} to="/create-listings">New Listing</Button>
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Availability</DialogTitle>
        <DialogContent>
          {availability.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={item.start}
                onChange={(e) => updateAvailability(index, 'start', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={item.end}
                onChange={(e) => updateAvailability(index, 'end', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button onClick={() => removeAvailability(index)}>Remove</Button>
            </Box>
          ))}
          <Button onClick={addAvailability}>Add More</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>Reviews for {selectedListing?.averageRating} Star Rating</DialogTitle>
        <DialogContent>
          <TableHead>
            <TableRow>
              <TableCell>Reviewer</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          {selectedListing?.reviews.map((review, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {review.reviewer}
              </TableCell>
              <TableCell align="left">
                {review.comment}
              </TableCell>
            </TableRow>
          ))}
        </DialogContent>
      </Dialog>

    </Box>

  );
}

export default HostedListing;
