const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    validate: {
      validator: function(value) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(value);
      },
      message: 'Time must be in HH:MM format (24-hour)'
    }
  },
  isBooked: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

slotSchema.index({ date: 1, time: 1 }, { unique: true });
slotSchema.index({ date: 1 });

module.exports = mongoose.model('Slot', slotSchema);
