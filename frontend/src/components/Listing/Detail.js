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
  TableHead, DialogActions, DialogContent, DialogTitle, Dialog
} from '@mui/material';
import listingService from './listingService';
import Rating from '@mui/material/Rating';
import Listing from './Class/listing';
import Review from './Class/review';
import { useAuth } from '../Auth/AuthContext';
import bookingService from './bookingService';

function DetailView () {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [email, setEmail] = useState();
  const { isLoggedIn } = useAuth();
  const [booking, setBooking] = useState();
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });
  // const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListingDetail(id);
        const data = response.data.listing;
        const reviews = data.reviews.map(review => new Review(review.reviewer, review.rating, review.comment));
        // console.log(new Listing(id, data.title, data.metadata.propertyType, data.metadata.numberOfBeds, data.metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published, data.availability, data.address));
        setListing(new Listing(id, data.title, data.metadata.propertyType, data.metadata.numberOfBeds, data.metadata.numberOfBathrooms, data.thumbnail, reviews, data.price, data.published, data.availability, data.address, data.owner));
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };

    fetchListing();
  }, []);

  const handleBookingChange = (e) => {
    setBookingDates({ ...bookingDates, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const days = (new Date(bookingDates.end) - new Date(bookingDates.start)) / (1000 * 3600 * 24);
      const totalPrice = days * parseFloat(listing.pricePerNight);

      const newBooking = {
        dateRange: {
          start: bookingDates.start,
          end: bookingDates.end
        },
        totalPrice
      };

      await bookingService.createBooking(id, newBooking);
      alert('Booking confirmed');
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking error: ' + error.response.data.error);
    }
  };
  
  const fetchBookings = async () => {
    try {
      const response = await bookingService.getBookings();
      const filteredBookings = response.data.bookings.filter(booking => parseInt(booking.listingId) === parseInt(id));
      setBookings(filteredBookings);
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

  const handleSubmitReview = async () => {
    try {
      const reviewer = localStorage.getItem('email');
      
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">{listing.title}</Typography>
      <Paper sx={{ my: 2 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Title</TableCell>
              <TableCell>{listing.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Address</TableCell>
              <TableCell>{listing.address.street}, {listing.address.city}, {listing.address.state} {listing.address.zipCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Price Per Night</TableCell>
              <TableCell>${listing.pricePerNight}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Property Type</TableCell>
              <TableCell>{listing.propertyType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Number of Bedrooms</TableCell>
              <TableCell>{listing.numberOfBeds}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Number of Bathrooms</TableCell>
              <TableCell>{listing.numberOfBathrooms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Review Rating</TableCell>
              <TableCell><Rating value={listing.averageRating} readOnly/></TableCell>
            </TableRow>
            {/* */}
          </TableBody>
        </Table>
      </Paper>
      {isLoggedIn && (
        <>
          <Paper sx={{ my: 2 }}>
            <Table>
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
          </Paper>
          <Box component="form" onSubmit={handleBookingSubmit}>
            <TextField
              name="start"
              label="Start Date"
              type="date"
              value={bookingDates.start}
              onChange={handleBookingChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="end"
              label="End Date"
              type="date"
              value={bookingDates.end}
              onChange={handleBookingChange}
              InputLabelProps={{ shrink: true }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Confirm Booking</Button>
          </Box>
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
