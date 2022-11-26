
const Bookings = require('../../models/booking');
const { transformBooking, transformEvent, singleEvent } = require('./merge')

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Bookings.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const event = singleEvent.bind(this, args.eventId);
            const userId = (event.creator);
            const booking = new Bookings({
                event: args.eventId,
                user: req.userId,
            })
            const result = await booking.save();
            return transformBooking(result);
        }
        catch (err) {
            throw err;
        }
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
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