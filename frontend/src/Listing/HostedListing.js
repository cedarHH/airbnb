import React, { useEffect, useState } from 'react';
import listingService from './listingService';
import Review from './Class/review';
import Listing from './Class/listing';
import {
  Box,
  Button,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router';

function HostedListing () {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
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

        const reviews = metadata.reviews.map(review => new Review(review.reviewer, review.rating, review.comment));

        return new Listing(item.id, data.title, metadata.propertyType, metadata.numberOfBeds, metadata.numberOfBathrooms, data.thumbnail, reviews, data.price);
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData().then(setListings);
  }, []);

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
                  <img src={listing.thumbnail} alt="Thumbnail" style={{ width: '50px' }} />
                </TableCell>
                <TableCell align="left">
                  <Rating value={listing.averageRating} precision={0.1} readOnly />
                </TableCell>
                <TableCell align="left">{listing.reviews.length}</TableCell>
                <TableCell align="left">${listing.pricePerNight}</TableCell>
                <TableCell align="left">
                  <Box display="flex">
                    <Button onClick={() => (handleEdit(listing.id))}>Edit</Button>
                    <Button onClick={() => (handleDelete(listing.id))}>Delete</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <Button component={RouterLink} to="/create-listings" >New Listing</Button>
      </Box>

    </Box>

  );
}

export default HostedListing;
