const Event = require('../../models/event');
const User = require('../../models/user');
const Bookings = require('../../models/booking');
const { dateToString } = require('../../helpers/date');



const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return {
                ...event._doc,
                creator: user.bind(this, event._doc.creator),
                date: new Date(event._doc.date).toISOString()
            };
        });
    } catch (err) {
        throw err;
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
        date: dateToString(event.date)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
    };
}


const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    }
    catch (err) {
        throw err;
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.singleEvent = singleEvent;