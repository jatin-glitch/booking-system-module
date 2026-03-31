const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { validateSlot, validateDateQuery } = require('../middlewares/validation');

router.post('/slots', validateSlot, slotController.createSlot);

router.get('/slots', validateDateQuery, slotController.getAvailableSlots);

module.exports = router;
