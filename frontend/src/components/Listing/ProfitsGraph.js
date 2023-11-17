import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getLast30DaysDates = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
  }
  return dates;
};

const ProfitsGraph = ({ bookings }) => {
  const dailyProfits = useMemo(() => {
    const profits = Array(30).fill(0);
    const currentDate = new Date();

    bookings.forEach(booking => {
      if (booking.status !== 'accepted') return;

      const startDate = new Date(booking.dateRange.start);
      const endDate = new Date(booking.dateRange.end);
      const dailyRate = booking.totalPrice / ((endDate - startDate) / (1000 * 3600 * 24));

      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(currentDate.getTime() - (i * 24 * 60 * 60 * 1000));
        if (checkDate >= startDate && checkDate < endDate) {
          profits[i] += dailyRate;
        }
      }
    });

    return profits.reverse();
  }, [bookings]);

  const dates = useMemo(() => getLast30DaysDates(), []);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Profits',
        data: dailyProfits,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <Box sx={{ width: '100%' }} data-testid="profits-graph">
      <Line data={data} />
    </Box>
  );
};

export default ProfitsGraph;
