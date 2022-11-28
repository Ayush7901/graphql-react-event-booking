const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const Bookings = require('../../models/booking');
const { dateToString } = require('../../helpers/date');


// gets all userIds / eventIds then makes a combine request
// after this splits the result to the functions making calls
// batching makes the backend very fatst therefore dataloader is used in prod level env
const eventLoader = new DataLoader(async eventIds => {
    return events(eventIds);
});

const userLoader = new DataLoader(async userIds => {
    console.log(userIds);
    try {
        const users = await User.find({ _id: { $in: userIds } });
        return users;
    }
    catch (err) {
        throw err;
    }
});

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        // const userIds  = [];
        // user._doc.createdEvents.map((userId) => {
        //     userIds.push(userId.toString());
        // })
        // const fetchCreatedEvents = async () => {
        //     const result = await eventLoader.load(user._doc.createdEvents);
        //     return result;
        // }
        return {
            ...user._doc,
            password: null,
            createdEvents: () => events(user._doc.createdEvents),
            // loadmany not working so we use this for now
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
                date: dateToString(event._doc.date)
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
    // console.log(booking._doc)
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
        const event = await eventLoader.load(eventId.toString());
        return event;
    }
    catch (err) {
        throw err;
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.singleEvent = singleEvent;