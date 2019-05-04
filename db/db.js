const mongoose = require('mongoose');

// Used nodemon.json for environment variable, to use the same env var on the dev(local) and production server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, err => {
    if(err) return console.log(err)
});

mongoose.connection.on('connected', () => console.log('\x1b[32m', 'DB conneted'));
