import React from 'react';
import { render } from '@testing-library/react';
import ProfitsGraph from './ProfitsGraph';

global.ResizeObserver = class ResizeObserver {
  constructor (callback) {
    this.callback = callback;
  }

  observe () {
  }

  disconnect () {
  }

  unobserve () {
  }
};

const mockBookings = [
  {
    id: 376248694,
    owner: 'christian@unsw.edu.au',
    dateRange: {
      start: '2023-11-16',
      end: '2023-11-17'
    },
    totalPrice: 2,
    listingId: '430924521',
    status: 'accepted'
  }
];

describe('ProfitsGraph Component', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<ProfitsGraph bookings={mockBookings} />);
    expect(getByTestId('profits-graph')).toBeInTheDocument();
  });
});
