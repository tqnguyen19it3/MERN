// child route
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');

//controllers
const homeController = require('../app/http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);

    //auth
    app.use('/api/auth', authRoute);

    // users
    app.use('/user', userRoute);
}

module.exports = initRoutes