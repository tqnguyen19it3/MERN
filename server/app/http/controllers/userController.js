const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');

function userController() {
    return {
        // [GET] / 
        async getListUser(req, res) {
            // 1. Get token from client
            const bearerHeader = req.headers['authorization'];
            // console.log(bearerHeader);
            const accessToken = bearerHeader.split(' ')[1];

            try {
                // 2. verify token
                const jwtDecoded = jwt.verify(accessToken, process.env.SECRET_JWT);
                if(jwtDecoded){
                    const users = await userModel.find();
                    res.status(200).send(users);
                }
            } catch (error) {
                console.log(error)
            }
        },
    }
}

module.exports = userController