const Joi = require('joi');

const slotValidationSchema = Joi.object({
  date: Joi.date().iso().required().messages({
    'date.base': 'Date must be a valid date',
    'date.format': 'Date must be in ISO format',
    'any.required': 'Date is required'
  }),
  time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Time must be in HH:MM format (24-hour)',
    'any.required': 'Time is required'
  })
});

const bookingValidationSchema = Joi.object({
  userId: Joi.string().required().trim().messages({
    'string.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required'
  }),
  slotId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid slot ID format',
    'any.required': 'Slot ID is required'
  })
});

const validateSlot = (req, res, next) => {
  const { error } = slotValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const { error } = bookingValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateDateQuery = (req, res, next) => {
  const { date } = req.query;
  
  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Date must be in YYYY-MM-DD format'
      });
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }
  }
  
  next();
};

module.exports = {
  validateSlot,
  validateBooking,
  validateDateQuery
};
