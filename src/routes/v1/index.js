const express = require('express');

const  {BookingController} = require('../../controllers/index.js');

//const channel = await createChannel();
const bookingController = new BookingController()
const router = express.Router();

router.post('/bookings', bookingController.create);
router.post('/publish',bookingController.sendMessageToQueue)
router.delete('/bookings/:id', bookingController.destroy);

module.exports = router