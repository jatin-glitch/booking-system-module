const slotService = require('../services/slotService');
const logger = require('../utils/logger');

class SlotController {
  async createSlot(req, res) {
    try {
      const slot = await slotService.createSlot(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Slot created successfully',
        data: slot
      });
    } catch (error) {
      logger.error('Controller - createSlot error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Slot with this date and time already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create slot'
      });
    }
  }

  async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;
      const slots = await slotService.getAvailableSlots(date);
      
      res.status(200).json({
        success: true,
        message: 'Available slots retrieved successfully',
        data: slots
      });
    } catch (error) {
      logger.error('Controller - getAvailableSlots error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve available slots'
      });
    }
  }
}

module.exports = new SlotController();
