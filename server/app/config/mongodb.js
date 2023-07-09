const mongoose = require('mongoose');

function connectDatabase(url){
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection
        .once('open',  () => console.log('MongoDB is running...'))
        .on('error', (err) => console.log("MongoDB connection failed: ", err.message));
}

module.exports = connectDatabase;
// const mongoose = require('mongoose');

// function connectDatabase(url){
    
//     const conn = mongoose.createConnection(url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     conn.on('connected', () =>
//         console.log('MongoDB is running...'));

//     conn.on('disconnected', () =>
//         console.log('MongoDB disconnected'));

//     conn.on('error', (err) =>
//         console.error(`MongoDB connection failed: ${JSON.stringify(err)}`));

//     process.on('SIGINT', async() => {
//         try {
//             await mongoose.connection.close();
//             console.log('Server disconnected from MongoDB');
//             process.exit(0);
//         } catch (err) {
//             console.error(`Error closing MongoDB connection: ${err}`);
//             process.exit(1);
//         }
//     });
// }

// module.exports = connectDatabase;
