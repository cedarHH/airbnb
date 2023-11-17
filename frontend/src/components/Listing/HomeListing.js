import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Slider,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow, TableCell, TableBody, Rating
} from '@mui/material';
import listingService from './listingService';
import Review from './Class/review';
import Listing from './Class/listing';
import { useNavigate } from 'react-router';

function SearchListings () {
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
          const reviews = data.reviews.map(review => new Review(review.reviewer, review.rating, review.comment));
          return new Listing(item.id, data.title, metadata.propertyType, metadata.numberOfBeds, metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published, data.availability, data.address, data.owner);
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().then(setListings);
    fetchData().then(setFilteredListings);
  }, []);

  useEffect(() => {
    console.log(listings)
  }, [listings]);

  const [searchParams, setSearchParams] = useState({
    searchString: '',
    bedroomsRange: [1, 5],
    startDate: '',
    endDate: '',
    priceRange: [0, 1000]
  });

  const handleSliderChange = (name) => (event, newValue) => {
    setSearchParams({ ...searchParams, [name]: newValue });
  };

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };
  const searchListings = (listings, searchParams) => {
    const { searchString, bedroomsRange, startDate, endDate, priceRange } = searchParams;

    return listings.filter(listing => {
      const matchesSearchString = listing.title.toLowerCase().includes(searchString.toLowerCase()) ||
        (listing.address && listing.address.city && listing.address.city.toLowerCase().includes(searchString.toLowerCase()));

      // console.log('matchesSearchString : ', matchesSearchString)

      const matchesBedrooms = parseInt(listing.numberOfBeds) >= bedroomsRange[0] && parseInt(listing.numberOfBeds) <= bedroomsRange[1];
      // console.log('matchesSearchString : ', matchesSearchString)

      const matchesPrice = parseFloat(listing.pricePerNight) >= priceRange[0] && parseFloat(listing.pricePerNight) <= priceRange[1];
      // console.log('matchesPrice : ', matchesPrice)

      let matchesDates = true;
      if (startDate && endDate) {
        matchesDates = listing.published.some(publishedRange =>
          new Date(publishedRange.start) <= new Date(startDate) && new Date(publishedRange.end) >= new Date(endDate)
        );
      }
      // console.log('Match : ', matchesSearchString, matchesBedrooms, matchesPrice, matchesDates)
      const isMatched = matchesSearchString && matchesBedrooms && matchesPrice && matchesDates;
      // console.log(`Listing ${listing.id} matched: ${isMatched}`);
      return isMatched;
    });
  };
  const [filteredListings, setFilteredListings] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Initial listings: ', listings);
    setFilteredListings(searchListings(listings, searchParams));
  };
  const navigate = useNavigate();
  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <TextField
          name="searchString"
          label="Search"
          value={searchParams.searchString}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Typography gutterBottom>Bedrooms Range: {searchParams.bedroomsRange.join(' - ')}</Typography>
        <Slider
          name="bedroomsRange"
          value={searchParams.bedroomsRange}
          onChange={handleSliderChange('bedroomsRange')}
          valueLabelDisplay="auto"
          min={1}
          max={10}
        />
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          value={searchParams.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          value={searchParams.endDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Typography gutterBottom>Price Range: ${searchParams.priceRange.join(' - $')}</Typography>
        <Slider
          name="priceRange"
          value={searchParams.priceRange}
          onChange={handleSliderChange('priceRange')}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Search</Button>
      </Box>
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
              {filteredListings.filter(listing => listing.published === true).map((listing) => (
                <TableRow key={listing.id} onClick={() => (navigate(`/detail/${listing.id}`))}>
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
    </>

  );
}

export default SearchListings;
