const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// Models
const userModel = require('../../models/user');

const isAuthentication = (req, res, next) => {
    try {
        // 1. Get token from client
        const bearerHeader = req.headers['authorization'];
        if(!bearerHeader){
            return next(createError.Unauthorized());
        }
        const accessToken = bearerHeader.split(' ')[1];
        // 2. verify token
        const jwtDecoded = jwt.verify(accessToken, process.env.SECRET_ACCESS_JWT);
        if(!jwtDecoded){
            return next(createError.Unauthorized());
        }
        req.payload = jwtDecoded;
        next();
    } catch (error) {
        return next(error);
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const userID = req.payload._id;
        const user = await userModel.findById({ _id: userID });
        if(user.role !== 'admin'){
            return next(createError.Forbidden());
        }else{
            next();
        } 
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    isAuthentication,
    isAdmin
}