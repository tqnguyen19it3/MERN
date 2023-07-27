const bcrypt = require('bcrypt');
const createError = require('http-errors');
const axios = require('axios');
const { userRegisterValidate, userLoginValidate} = require('../../validations/validation');
const { generateRandomPassword } = require('../../helpers/generate_password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../services/jwt.service');
const { sendPasswordEmail } = require('../../services/sendMail.service');
const redisClient = require('../../config/redis');

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
        // [DELETE] / logout
        async logout(req, res, next) {
            try {
                const { refreshToken } = req.body;
                if(!refreshToken){
                    throw createError.BadRequest();
                } 
                const { _id } = await verifyRefreshToken(refreshToken);
                redisClient.del(_id, (err, reply) => {
                    if(err){
                        throw createError.InternalServerError();
                    } 
                    res.status(200).json({
                        'message': 'Logout Successfully!'
                    })
                });
            } catch (error) {
                next(error);
            }
        },
        // [POST] / rest password when forget
        async forgotPassword(req, res, next){
            try {
                const { email } = req.body;
                if(!email) throw createError.Conflict(`Failed! Email is required`);
                //check user exits
                const user = await userModel.findOne({ email });
                if(!user){
                    throw createError.NotFound(`Failed! ${email} not registered`);
                }
                // create new password
                const password  = await generateRandomPassword();
                const hashedPassword = await bcrypt.hashSync(password, 10);

                // update new password in db
                await userModel.updateOne({ email: email }, { password: hashedPassword });

                await sendPasswordEmail(
                    email,
                    user.name,
                    "Reset Your Password",
                    password,
                    `<p>Your password is: ${password}</p>`
                );

                return res.status(200).json({
                    message: "You should receive an email!",
                });
                
            } catch (error) {
                next(error);
            }
        },
        // [POST] / refresh token
        async refreshToken(req, res, next) {
            try {
                const { refreshToken } = req.body;
                if(!refreshToken) throw createError.BadRequest();

                const {_id, name, role} = await verifyRefreshToken(refreshToken);
                const accessTokenUser = await signAccessToken({_id, name, role});
                const refreshTokenUser = await signRefreshToken({_id, name, role});

                res.status(200).json({accessTokenUser, refreshTokenUser});
            } catch (error) {
                next(error);
            }
        },
        // [POST] / login google
        authGoogle(req, res, next) {
            if(req.body.access_token){
                axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        "Authorization": `Bearer ${req.body.access_token}`
                    }
                }).then(async response => {
                    const { email, given_name, family_name, picture, sub } = response.data;
                    const name = `${(family_name || "")} ${(given_name || "")}`;

                    // check email exits
                    let user = await userModel.findOne({  $or: [{ email }, { googleId: sub }] });
                    if (user) {
                        // Update user info
                        user.name = name;
                        user.googleId = sub;
                        await user.save();
                    }else {
                        // store 1 user in mongodb
                        user = await userModel.create({
                            name,
                            email,
                            googleId: sub
                        });
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
                        message: "Login google successfully!", 
                        accessToken: accessTokenUser,
                        refreshToken: refreshTokenUser
                    });
                }).catch(err => next(err));
            }else{
                return next(createError.BadRequest("Access token is required"));
            }
        }
    }
}

module.exports = authController