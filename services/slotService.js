const Slot = require('../models/Slot');
const logger = require('../utils/logger');

class SlotService {
  async createSlot(slotData) {
    try {
      const slot = new Slot(slotData);
      await slot.save();
      logger.info(`Slot created: ${slot._id}`);
      return slot;
    } catch (error) {
      logger.error('Error creating slot:', error);
      throw error;
    }
  }

  async getAvailableSlots(date = null) {
    try {
      let query = { isBooked: false };
      
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        
        query.date = {
          $gte: startDate,
          $lt: endDate
        };
      }

      const slots = await Slot.find(query)
        .sort({ date: 1, time: 1 })
        .lean();
      
      logger.info(`Found ${slots.length} available slots`);
      return slots;
    } catch (error) {
      logger.error('Error fetching available slots:', error);
      throw error;
    }
  }

  async getSlotById(slotId) {
    try {
      const slot = await Slot.findById(slotId).lean();
      if (!slot) {
        throw new Error('Slot not found');
      }
      return slot;
    } catch (error) {
      logger.error('Error fetching slot:', error);
      throw error;
    }
  }
}

module.exports = new SlotService();
