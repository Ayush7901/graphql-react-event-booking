
const Bookings = require('../../models/booking');
const {transformBooking, transformEvent, singleEvent} = require('./merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Bookings.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async (args) => {
        try {
            const event = singleEvent.bind(this, args.eventId);
            const userId = (event.creator);
            const booking = new Bookings({
                event: args.eventId,
                user: '636d22f6d07bd7ecd67c4fb0',
            })
            const result = await booking.save();
            return transformBooking(result);
        }
        catch (err) {
            throw err;
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Bookings.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            const result = await Bookings.deleteOne({ _id: args.bookingId });
            return event;
        }
        catch (err) {

        }
    }

}