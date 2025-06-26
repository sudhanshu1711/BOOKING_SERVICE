const axios = require('axios');
const {BookingRepo} = require('../repository/index.js')
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig.js');
const { ServiceError } = require('../utils/errors/index.js');

class BookingService {
   constructor(){
    this.bookingRepo = new BookingRepo();
   }
   async createBooking(data){
     try {
        const flightId = data.flightId;
        let getFlightUrlResponse = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
        const response =  await axios.get(getFlightUrlResponse);
        const  flightData = response.data.data;
        let priceOfFlight = flightData.price;
        if(data.noOfSeats > flightData.totalSeats){
            throw new ServiceError('something went wrong while booking', 'Insufficient seats');
        }  
        const totalPrice = priceOfFlight * data.noOfSeats;
        const bookingData = {...data,totalCost: totalPrice};
         const booking = await this.bookingRepo.create(bookingData);
        const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
        axios.patch(updateFlightRequestUrl, {
            totalSeats: flightData.totalSeats - booking.noOfSeats
        });
         const finalBooking =await this.bookingRepo.update(booking.id, {status: 'BOOKED'});
        return finalBooking;
     } catch (error) {
      if(error.name === 'Repository Error'||error.name === 'ValidationError'){
         throw error;}
        throw new ServiceError()
     }
   } 
   async deleteBooking(id) {
    try {
        const booking = await this.bookingRepo.get(id);

        if (booking.status === 'CANCELLED') {
            throw new ServiceError('Booking already cancelled', 'Cannot cancel booking');
        }

        const flightId = booking.flightId;
        const getFlightUrlResponse = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
        const response = await axios.get(getFlightUrlResponse);
        const flightData = response.data.data;

        await axios.patch(`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`, {
            totalSeats: flightData.totalSeats + booking.noOfSeats
        });

        const updatedBooking = await this.bookingRepo.update(id, {
            status: 'CANCELLED'
        });

        return updatedBooking;

    } catch (error) {
        console.error("Error in deleteBooking:", error);
        if (error.name === 'Repository Error' || error.name === 'ValidationError') {
            throw error;
        }
        throw new ServiceError('Something went wrong while cancelling the booking');
    }
}
}

module.exports = BookingService;