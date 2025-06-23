const { ValidationError, AppError } = require('../utils/errors/index.js');
const {StatusCodes } = require('http-status-codes');
const {Booking} = require('../models/index.js')

class BookingRepo{
   async create(data){
    try {
        const booking = await Booking.create(data);
        return booking;
    } catch (error) {
        if(error.name=='SequelizeValidationError'){
            throw new ValidationError(error)
        }
        throw new AppError('Repository Error',
            'Cannot create booking',
            'There was some issue while booking',
            StatusCodes.INTERNAL_SERVER_ERROR)
    }
   }
}
module.exports = BookingRepo;