const bcrypt = require('bcryptjs')

const Event = require('../../models/event');
const User = require('../../models/user');
const Bookings = require('../../models/booking');

// the below codes populates the required data required by bith user and event object upto nesacaary depth required

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
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
                creator: user.bind(this, event._doc.creator), date: new Date(event._doc.date).toISOString()
            };
        });
    } catch (err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            date: new Date(event.date).toISOString(),
            creator: user.bind(this, event.creator)
        };
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    events: () => {
        return Event.find().then(events => {
            return events.map(event => {
                return { ...event._doc, creator: user.bind(this, event._doc.creator), date: new Date(event._doc.date).toISOString() };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },

    bookings: async () => {
        try {
            const bookings = await Bookings.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()
                }
            })
        }
        catch (err) {
            throw err;
        }
    },

    createEvent: (args) => {
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        // }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '636d22f6d07bd7ecd67c4fb0'
        })
        return event.save().then(result => {
            createdEvent = { ...result._doc, password: null }
            return User.findById('636d22f6d07bd7ecd67c4fb0');

        }).then(user => {
            if (!user) {
                throw new Error('No such user exists!');
            }
            user.createdEvents.push(event);
            return user.save()


        }).then(result => {
            return createdEvent;
        }).catch(err => {
            console.log(err)
            throw err;
        })
        // return event;
    },

    createUser: args => {
        let createdEvent;
        return User.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error('User already exists!');
            }
            return bcrypt.hash(args.userInput.password, 12)

        }).then(hashedPassword => {
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            return user.save()
        }).catch(err => {
            // console.log('Couldn\'t hash the password!');
            throw err;
        })





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
            return {
                ...result._doc,
                event: event,
                user: user.bind(this, result._doc.user),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        }
        catch (err) {
            throw err;
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Bookings.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event.creator),
                date: new Date(booking.event.date).toISOString(),

            }
            const result = await Bookings.deleteOne({ _id: args.bookingId });
            return event;
        }
        catch (err) {

        }
    }

}