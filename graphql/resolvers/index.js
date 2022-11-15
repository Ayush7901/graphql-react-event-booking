const authResolvers = require('./auth');
const bookingResolvers = require('./booking');
const eventResolvers = require('./events');


const rootResolver = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventResolvers
}

module.exports = rootResolver;