const jwt = require('jsonwebtoken');
const createError = require('http-errors');

//models
const userModel = require('../../models/user');

function userController() {
    return {
        // [GET] / list user
        async getListUser(req, res, next) {
            // 1. Get token from client
            const bearerHeader = req.headers['authorization'];
            // console.log(bearerHeader);
            if(!bearerHeader){
                return next(createError.Unauthorized());
            }
            const accessToken = bearerHeader.split(' ')[1];

            try {
                // 2. verify token
                const jwtDecoded = jwt.verify(accessToken, process.env.SECRET_ACCESS_JWT);
                if(jwtDecoded){
                    const users = await userModel.find();
                    res.status(200).json({
                        message: "Get list users successfully!",
                        users
                    });
                }
            } catch (error) {
                next(error);
            }
        },
    }
}

module.exports = userController