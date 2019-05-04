const express = require('express');
const graphqlHTTP = require('express-graphql');
const logger = require('morgan');

const isAuth = require('./middleware/isAuth');
const schema = require('./graphql/schema/index');
const resolver = require('./graphql/resolver/user');

require('./db/db');

const app = express();

// Middlewares
app.use(logger('short'));
app.use(
  '/graphql',
  isAuth,
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Error endpoint not found.' })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
