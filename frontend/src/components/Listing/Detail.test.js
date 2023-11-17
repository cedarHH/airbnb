import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DetailView from './Detail';
import * as reactRouterDom from 'react-router-dom';
import * as AuthContext from '../Auth/AuthContext';
import listingService from './listingService';
import bookingService from './bookingService';

// useParams, useAuth, listingService, bookingService
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));
jest.mock('../Auth/AuthContext', () => ({
  useAuth: jest.fn()
}));
jest.mock('./listingService', () => ({
  getListingDetail: jest.fn()
}));
jest.mock('./bookingService', () => ({
  getBookings: jest.fn(),
  createBooking: jest.fn(),
  deleteBooking: jest.fn(),
  acceptBooking: jest.fn(),
  declineBooking: jest.fn()
}));

describe('DetailView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reactRouterDom.useParams.mockReturnValue({ id: '1' });
    AuthContext.useAuth.mockReturnValue({
      isLoggedIn: true,
      logout: jest.fn()
    });
    listingService.getListingDetail.mockResolvedValue({
      data: {
        listing: {
          title: '1',
          owner: 'test@123',
          address: { street: '4', city: '5', state: '6', zipCode: '7' },
          price: '2',
          thumbnail: '3',
          metadata: {
            propertyType: 'Apartment',
            numberOfBeds: '8',
            numberOfBathrooms: '10',
            reviews: [],
            youtube: ''
          },
          reviews: [
          ],
          availability: [{ start: '2023-11-17', end: '2023-11-24' }],
          published: true,
          postedOn: '2023-11-16T02:51:06.378Z'
        }
      }
    });
    bookingService.getBookings.mockResolvedValue({
      data: {
        bookings: [
        ]
      }
    });
  });

  test('renders DetailView component with listing details', async () => {
    const { getAllByText } = render(<DetailView />);

    await waitFor(() => {
      const titleElements = getAllByText('1');
      expect(titleElements.length).toBeGreaterThan(0);
    });
  });
});
