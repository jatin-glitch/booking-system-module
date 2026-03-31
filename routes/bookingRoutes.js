const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middlewares/validation');

router.post('/book', validateBooking, bookingController.bookSlot);

router.get('/bookings', bookingController.getAllBookings);

router.get('/bookings/:id', bookingController.getBookingById);

router.get('/users/:userId/bookings', bookingController.getBookingsByUserId);

module.exports = router;
