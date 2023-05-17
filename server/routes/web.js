// child route
const userRoute = require('./userRoute');

//controllers
const homeController = require('../app/http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);

    // users
    app.use('/user', userRoute);
}

module.exports = initRoutes