const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_ACCESS_JWT , { expiresIn: 60 * 60 }, (err, accessToken) => {
            if(err) reject(err);
            resolve(accessToken);
        }); 
    });
}

const signRefreshToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_REFRESH_JWT , { expiresIn: '1y' }, (err, refreshToken) => {
            if(err) reject(err);
            resolve(refreshToken);
        }); 
    });
}

module.exports = {
    signAccessToken,
    signRefreshToken
}