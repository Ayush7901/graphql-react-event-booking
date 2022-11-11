const bcrypt = require('bcryptjs')

const Event = require('../../models/event');
const User = require('../../models/user');

const user = userId => {
    return User.findById(userId).then(user => {
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
    }).catch(err => {
        throw err;
    })
}

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } }).then(events => {
        return events.map(event => {
            return { ...event._doc, creator: user.bind(this, event._doc.creator) };
        })
    }).catch(err => {
        throw err;
    })
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





    }

}