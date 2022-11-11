const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs')

const Event = require('./models/event');
const User = require('./models/user');

const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id : ID!
            title : String!
            description : String!
            price : Float!
            date : String!
            creator: User!
        }

        type User{
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput{
            _id : ID
            title : String!
            description : String!
            price : Float!
            date : String!
        }

        input UserInput{
            _id : ID
            email: String!
            password : String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput : EventInput) : Event
            createUser(userInput : UserInput) : User
        }

        schema {
            query: RootQuery,
            mutation: RootMutation,
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return { ...event._doc };
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

    },
    graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.e88gfo2.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3001);
}).catch(err => { console.log(err) })

