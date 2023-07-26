// child route
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');

// Controllers
const homeController = require('../app/http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);

    //auth
    app.use('/api/auth', authRoute);

    // users
    app.use('/user', userRoute);

    // admin
    app.use('/auth/admin', adminRoute);
}

module.exports = initRoutes