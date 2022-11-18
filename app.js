const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const app = express();
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth')
app.use(bodyParser.json());

// how to allow Cross Origin Request for that we add som headers in our request
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
    
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        // internal browser request we don't allow it to reach graphql server bcz it can't handle that
        return res.sendStatus(200);
    }
    next();
})
app.use(isAuth);




app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.e88gfo2.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3001);
}).catch(err => { console.log(err) })

