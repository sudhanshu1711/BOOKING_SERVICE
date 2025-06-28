const {BookingService} = require('../services/index.js');
const {StatusCodes} = require('http-status-codes')
const {createChannel,publishMessage} = require('../utils/messageQueue.js');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig.js')

const bookingService = new BookingService();

class BookingController{
   constructor(){
   }
   async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const data = { message: "success" };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(200).json({
        success: true
    });
}
     async create (req,res){
   try {
      const response = await bookingService.createBooking(req.body);
      return  res.status(StatusCodes.CREATED).json({
            data: response,
            success: true,
            message: 'Successfully created a booking',
            error: {}
      })
   } catch (error) {
      return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            error: error.explanation
      })
   }
}
   async destroy(req,res){
   try {
      const response = await bookingService.deleteBooking(req.params.id);
      return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: 'Successfully cancelled the booking',
            error: {}
      })
   } catch (error) {
      return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            error: error.explanation
      })
   }
   }
}
   module.exports = BookingController