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
   async update(id,data){
    try {
        const booking = await Booking.update(data, {
            where: {
                id: id
            }
        });
        const updatedBooking = await Booking.findByPk(id);
        return updatedBooking;
    } catch (error) {
        throw new AppError('Repository Error',
            'Cannot update booking',
            'There was some issue while updating the booking',
            StatusCodes.INTERNAL_SERVER_ERROR)
    }
   }
   async get(id){
    try {
        const booking = await Booking.findByPk(id);
        if(!booking){
            throw new AppError('Repository Error',
                'Booking not found',
                'There was no booking with the given id',
                StatusCodes.NOT_FOUND)
        }
        return booking;
    } catch (error) {
        throw new AppError('Repository Error',
            'Cannot get booking',
            'There was some issue while fetching the booking',
            StatusCodes.INTERNAL_SERVER_ERROR)
    }
   }
}
module.exports = BookingRepo;