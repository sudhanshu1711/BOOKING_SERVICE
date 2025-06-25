const {BookingService} = require('../services/index.js');
const {StatusCodes} = require('http-status-codes')

const bookingService = new BookingService();

const create = async (req,res)=>{
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

module.exports = {
    create
}