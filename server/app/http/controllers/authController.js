const userModel = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function authController() {
    return {
        // [POST] / register
        async register(req, res) {
            try {
                const { name, email, password } = req.body;
                // check fill all fields
                if(!name || !email || !password){
                    res.status(400).send("Register Failed! Please fill in all fields");
                }
                // check email exits
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {
                    res.status(400).send('Register Failed! Email already exists');
                }
                // store 1 user in mongodb
                await userModel.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, 10)
                });
                return res.status(200).send("Register Successfully!");

            } catch (error) {
                console.log('Error: ', error);
            }
        },
        // [POST] / login
        async login(req, res) {
            try {
                const { email, password } = req.body;
                // check fill all fields
                if(!email || !password){
                    res.status(400).send("Please fill in all fields");
                }
                //check user exits
                const user = await userModel.findOne({ email });
                if(!user){
                    return res.status(400).send('Invalid Email');
                }
                //check password
                const isPassValid = bcrypt.compareSync(password, user.password);
                if(!isPassValid){
                    return res.status(400).send('Invalid Password');
                }
                // create jwt when login success
                const jwtUser = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    role: user.role
                  }, process.env.SECRET_JWT , { expiresIn: 60 * 60 }); 

                return res.status(200).send({
                    message: "Login successfully!",
                    accessToken: jwtUser
                });

            } catch (error) {
                console.log('Error: ', error);
            }
        },
    }
}

module.exports = authController