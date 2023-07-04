require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./app/config/db');

const PORT = process.env.PORT || 5000;
const url = process.env.DB_CONNECTION_STRING;

//connect database
connectDB(url);

app.use(cors());

//middleware get info from client by req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//route
require('./routes/web')(app);

//check server start
const server = app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})