import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  TableHead, DialogActions, DialogContent, DialogTitle, Dialog, TableContainer
} from '@mui/material';
import listingService from './listingService';
import Rating from '@mui/material/Rating';
import Listing from './Class/listing';
import Review from './Class/review';
import { useAuth } from '../Auth/AuthContext';
import bookingService from './bookingService';
// eslint-disable-next-line no-unused-vars
import ProfitsGraph from './ProfitsGraph';

function DetailView () {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [email, setEmail] = useState();
  const { isLoggedIn } = useAuth();
  const [booking, setBooking] = useState();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    setEmail(localStorage.getItem('email'))
  }, []);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListingDetail(id);
        const data = response.data.listing;
        const reviews = data.reviews.map(review => new Review(review.reviewer, review.rating, review.comment));
        // console.log(new Listing(id, data.title, data.metadata.propertyType, data.metadata.numberOfBeds, data.metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published, data.availability, data.address));
        setListing(new Listing(id, data.title, data.metadata.propertyType, data.metadata.numberOfBeds, data.metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published, data.availability, data.address, data.owner, data.postedOn, data.metadata.youtube));
        console.log(listing)
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };

    fetchListing();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getBookings();
      const filteredBookings = response.data.bookings.filter(booking => parseInt(booking.listingId) === parseInt(id));
      setBookings(filteredBookings);
      console.log(filteredBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
    }
  }, [id, isLoggedIn]);
  const [openDialog, setOpenDialog] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: ''
  });

  // eslint-disable-next-line no-unused-vars
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReviewChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setReview({ ...review, rating: newRating });
  };
  const calculateDuration = (postedOn) => {
    const postedDate = new Date(postedOn);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - postedDate.getTime();

    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays < 30) {
      return `${differenceInDays} days`;
    }

    const differenceInMonths = Math.floor(differenceInDays / 30);
    if (differenceInMonths < 12) {
      return `${differenceInMonths} months`;
    }

    const differenceInYears = Math.floor(differenceInMonths / 12);
    return `${differenceInYears} years`;
  };

  const handleAccept = async (booking) => {
    try {
      bookingService.acceptBooking(booking.id);
      alert('Successful to accept booking!');
      fetchBookings();
    } catch (error) {
      console.log(error)
      alert('Error in accepted booking because: ' + error.response.data.error);
      fetchBookings();
    }
  }
  const handleDecline = async (booking) => {
    try {
      bookingService.declineBooking(booking.id);
      alert('Successful to decline booking!')
    } catch (error) {
      console.log(error)
      alert('Error in declined booking because: ' + error.response.data.error);
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    try {
      await bookingService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Booking deleted');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking');
    }
  };

  if (!listing) {
    return <Typography>Loading...</Typography>;
  }
  const calculateBookedDaysThisYear = (bookings) => {
    const currentYear = new Date().getFullYear();
    return bookings
      .filter(booking =>
        booking.status === 'accepted' &&
        new Date(booking.dateRange.start).getFullYear() === currentYear
      )
      .reduce((totalDays, booking) => {
        const startDate = new Date(booking.dateRange.start);
        const endDate = new Date(booking.dateRange.end);
        const duration = (endDate - startDate) / (1000 * 3600 * 24);
        return totalDays + duration;
      }, 0);
  };
  const calculateProfitThisYear = (bookings) => {
    const currentYear = new Date().getFullYear();
    return bookings
      .filter(booking =>
        booking.status === 'accepted' &&
        new Date(booking.dateRange.start).getFullYear() === currentYear
      )
      .reduce((totalProfit, booking) => totalProfit + booking.totalPrice, 0);
  };

  const bookedDaysThisYear = calculateBookedDaysThisYear(bookings);
  const profitThisYear = calculateProfitThisYear(bookings);
  const handleSubmitReview = async () => {
    try {
      const reviewer = localStorage.getItem('email');
      // eslint-disable-next-line no-unused-vars
      const newReview = {
        reviewer,
        rating: review.rating,
        comment: review.comment
      };
      await listingService.reviewListing(booking.listingId, booking.id, newReview);

      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleReviewBooking = (booking) => {
    setBooking(booking);
    handleOpenDialog();
  }
  const extractYoutubeId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">{listing.title}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="listings table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>{listing.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>{listing.address.street}, {listing.address.city}, {listing.address.state} {listing.address.zipCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price / Night</TableCell>
              <TableCell>${listing.pricePerNight}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Property Type</TableCell>
              <TableCell>{listing.propertyType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bedrooms</TableCell>
              <TableCell>{listing.numberOfBeds}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bathrooms</TableCell>
              <TableCell>{listing.numberOfBathrooms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rating</TableCell>
              <TableCell><Rating value={listing.averageRating} readOnly/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{listing.published === true ? 'Published' : 'Unpublished'}</TableCell>
            </TableRow>
            {listing.published === true && (
              <TableRow>
                <TableCell>Time Online</TableCell>
                <TableCell>{calculateDuration(listing.postedOn)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Booked Days This Year</TableCell>
              <TableCell>{bookedDaysThisYear} days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Profit This Year</TableCell>
              <TableCell>${profitThisYear}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Videos</TableCell>
              <TableCell>
                {listing.youtube && listing.youtube !== '' && (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${extractYoutubeId(listing.youtube)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </TableCell>

            </TableRow>
              <ProfitsGraph bookings={bookings} />
            {/* */}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={2} />
      {isLoggedIn && (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="listings table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.dateRange.start}</TableCell>
                    <TableCell>{booking.dateRange.end}</TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      {/* booking */}
                      {email === booking.owner && (<Box display='flex'>
                        {booking.status === 'accepted' && (
                          <Button onClick={() => handleReviewBooking(booking)}>Review</Button>)}
                        <Button onClick={() => handleDeleteBooking(booking.id)}>Delete</Button>
                      </Box>)}
                      {/* listing owner */}
                      {email === listing.owner && (
                        <Box display='flex'>
                          {booking.status === 'pending' && (
                            <>
                              <Button onClick={() => handleAccept(booking)}>Accept</Button>
                              <Button onClick={() => handleDecline(booking)}>Decline</Button>
                            </>)}
                          {/* <Button onClick={() => handleDeleteBooking(booking.id)}>Delete</Button> */}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Rating
            name="rating"
            value={review.rating}
            onChange={(event, newValue) => {
              handleRatingChange(newValue);
            }}
          />
          <TextField
            name="comment"
            label="Comment"
            value={review.comment}
            onChange={handleReviewChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DetailView;
