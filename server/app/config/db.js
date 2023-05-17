const mongoose = require('mongoose');

function connectDatabase(url){
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection
        .once('open',  () => console.log('MongoDB is running...'))
        .on('error', (err) => console.log("MongoDB connection failed: ", err.message));
}

module.exports = connectDatabase;
