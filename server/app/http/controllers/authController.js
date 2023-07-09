const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { userRegisterValidate, userLoginValidate} = require('../../validations/validation');
const { signAccessToken, signRefreshToken } = require('../../services/jwt.service');

//models
const userModel = require('../../models/user');

function authController() {
    return {
        // [POST] / register
        async register(req, res, next) {
            try {
                const { name, email, password } = req.body;
                // validate all fields
                const { error } = userRegisterValidate(req.body);
                if(error){
                    throw createError(error.details[0].message);
                }
                // check email exits
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {
                    throw createError.Conflict(`Register Failed! ${email} already exists`);
                }
                // store 1 user in mongodb
                const user = await userModel.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, 10)
                });
                return res.status(200).json({
                    message: "Register Successfully!",
                    user
                });

            } catch (error) {
                next(error);
            }
        },
        // [POST] / login
        async login(req, res, next) {
            try {
                const { email, password } = req.body;
                // validate all fields
                const { error } = userLoginValidate(req.body);
                if(error){
                    throw createError(error.details[0].message);
                }
                //check user exits
                const user = await userModel.findOne({ email });
                if(!user){
                    throw createError.NotFound(`Login Failed! ${email} not registered`);
                }
                //check password
                const isPassValid = bcrypt.compareSync(password, user.password);
                if(!isPassValid){
                    throw createError.Unauthorized();
                }
                // create jwt when login success
                const payload = {
                    _id: user._id,
                    name: user.name,
                    role: user.role
                }
                const accessTokenUser = await signAccessToken(payload);
                const refreshTokenUser = await signRefreshToken(payload);
                return res.status(200).json({
                    message: "Login successfully!", 
                    accessToken: accessTokenUser,
                    refreshToken: refreshTokenUser
                });

            } catch (error) {
                next(error);
            }
        },
        // [POST] / logout
        logout(req, res, next) {
            return res.status(200).json({
                message: "Logout successfully!"
            });
        }
    }
}

module.exports = authController