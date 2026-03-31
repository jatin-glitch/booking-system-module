const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

class BookingService {
  async bookSlot(userId, slotId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const slot = await Slot.findById(slotId).session(session);
      
      if (!slot) {
        await session.abortTransaction();
        throw new Error('Slot not found');
      }

      if (slot.isBooked) {
        await session.abortTransaction();
        throw new Error('Slot already booked');
      }

      const updatedSlot = await Slot.findOneAndUpdate(
        { 
          _id: slotId, 
          isBooked: false 
        },
        { 
          isBooked: true 
        },
        { 
          new: true, 
          session: session 
        }
      );

      if (!updatedSlot) {
        await session.abortTransaction();
        throw new Error('Slot already booked or not found');
      }

      const booking = new Booking({
        userId,
        slotId
      });

      await booking.save({ session });

      await session.commitTransaction();
      logger.info(`Slot booked: ${slotId} by user: ${userId}`);
      
      return booking;
    } catch (error) {
      await session.abortTransaction();
      logger.error('Error booking slot:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllBookings(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const bookings = await Booking.find()
        .populate('slotId', 'date time isBooked')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Booking.countDocuments();
      
      logger.info(`Fetched ${bookings.length} bookings`);
      
      return {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('slotId', 'date time isBooked')
        .lean();
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
    } catch (error) {
      logger.error('Error fetching booking:', error);
      throw error;
    }
  }

  async getBookingsByUserId(userId) {
    try {
      const bookings = await Booking.find({ userId })
        .populate('slotId', 'date time isBooked')
        .sort({ createdAt: -1 })
        .lean();
      
      logger.info(`Fetched ${bookings.length} bookings for user: ${userId}`);
      return bookings;
    } catch (error) {
      logger.error('Error fetching user bookings:', error);
      throw error;
    }
  }
}

module.exports = new BookingService();
