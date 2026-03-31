require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Booking System API is running',
    version: '1.0.0',
    endpoints: {
      slots: {
        'POST /slots': 'Create a new slot',
        'GET /slots': 'Get available slots (optional date filter)'
      },
      bookings: {
        'POST /book': 'Book a slot',
        'GET /bookings': 'Get all bookings with pagination',
        'GET /bookings/:id': 'Get booking by ID',
        'GET /users/:userId/bookings': 'Get bookings by user ID'
      }
    }
  });
});

app.use('/api/v1', slotRoutes);
app.use('/api/v1', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
