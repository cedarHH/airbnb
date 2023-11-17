import React, { useEffect, useState } from 'react';
import listingService from './listingService';
import Listing from './Class/listing';
import Review from './Class/review';
import {
  Box,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

function AllListing () {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listingService.getAllListing();
        const listingsData = response.data.listings;
        return await Promise.all(listingsData.map(async (item) => {
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

    fetchData().then(setListings);
  }, []);
  return (
    <Box m={3} p={1}>
      <TableContainer component={Paper}>
        <Table aria-label="listings table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Property Type</TableCell>
              <TableCell align="right">Beds</TableCell>
              <TableCell align="right">Bathrooms</TableCell>
              <TableCell align="right">Thumbnail</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Reviews</TableCell>
              <TableCell align="right">Price (per night)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell component="th" scope="row">
                  {listing.title}
                </TableCell>
                <TableCell align="right">{listing.propertyType}</TableCell>
                <TableCell align="right">{listing.numberOfBeds}</TableCell>
                <TableCell align="right">{listing.numberOfBathrooms}</TableCell>
                <TableCell align="right">
                  <img src={listing.thumbnail} alt="Thumbnail" style={{ width: '50px' }} />
                </TableCell>
                <TableCell align="right">
                  <Rating value={listing.averageRating} precision={0.1} readOnly />
                </TableCell>
                <TableCell align="right">{listing.reviews.length}</TableCell>
                <TableCell align="right">${listing.pricePerNight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  );
}

export default AllListing;
