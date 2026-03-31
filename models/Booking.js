const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: [true, 'Slot ID is required']
  }
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ slotId: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
