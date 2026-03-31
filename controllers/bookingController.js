const bookingService = require('../services/bookingService');
const logger = require('../utils/logger');

class BookingController {
  async bookSlot(req, res) {
    try {
      const { userId, slotId } = req.body;
      const booking = await bookingService.bookSlot(userId, slotId);

      res.status(201).json({
        success: true,
        message: 'Slot booked successfully',
        data: booking
      });
    } catch (error) {
      logger.error('Controller - bookSlot error:', error);

      if (error.message === 'Slot not found' || error.message === 'Slot already booked') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This slot is already booked'
        });
      }

      if (error.message && error.message.includes('Write conflict')) {
        return res.status(409).json({
          success: false,
          message: 'Slot is currently being booked by someone else'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to book slot'
      });
    }
  }

  async getAllBookings(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await bookingService.getAllBookings(page, limit);

      res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: result.bookings,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Controller - getAllBookings error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);

      res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: booking
      });
    } catch (error) {
      logger.error('Controller - getBookingById error:', error);

      if (error.message === 'Booking not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve booking'
      });
    }
  }

  async getBookingsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const bookings = await bookingService.getBookingsByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'User bookings retrieved successfully',
        data: bookings
      });
    } catch (error) {
      logger.error('Controller - getBookingsByUserId error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve user bookings'
      });
    }
  }
}

module.exports = new BookingController();
