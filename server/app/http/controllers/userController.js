const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { userRegisterValidate } = require('../../validations/validation');

// Models
const userModel = require('../../models/user');

function userController() {
    return {
        // [GET] / list user
        async getListUser(req, res, next) {
            try {
                const users = await userModel.find({ role: { $ne: "admin" } });
                return res.status(200).json({
                    message: "Get List Users Successfully!",
                    users
                });
            } catch (error) {
                next(error);
            }
        },
        // [POST] / create user
        async createUser(req, res, next) {
            try {
                const { name, email, password, role } = req.body;
                // validate all fields
                const { error } = userRegisterValidate(req.body);
                if(error){
                    throw createError(error.details[0].message);
                }
                // check email exits
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {
                    throw createError.Conflict(`Create User Failed! ${email} already exists`);
                }
                // store 1 user in mongodb
                const user = await userModel.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, 10),
                    role
                });
                return res.status(200).json({
                    message: "Create User Successfully!",
                    user
                });
            } catch (error) {
                next(error);
            }
        },
        // [DELETE] / soft delete user
        softDeleteUser(req, res, next) {
            userModel.delete({ _id: req.params.userID })
                .then((data) => {
                    console.log(data);
                    return res.status(200).json({
                        message: "Move User To Trash Successfully!",
                    });
                })
                .catch(err => {
                    next(err);
                })
        },
        // [GET] / get deleted user
        async trashUser(req, res, next) {
            try{
                const deletedUsers = await userModel.findDeleted();
                if(deletedUsers.length === 0) return res.status(200).json({
                    message: "List Deleted User Is Empty!",
                    deletedUsers
                });
                return res.status(200).json({
                    message: "Get List Deleted User Successfully!",
                    deletedUsers
                });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / restore user
        restoreUser(req, res, next) {
            userModel.restore({ _id: req.params.userID })
            .then((data) => {
                console.log(data);
                return res.status(200).json({
                    message: "Restore User Successfully!",
                });
            })
            .catch(err => {
                next(err);
            })
        },
        // [DELETE] / destroy user
        async destroyUser(req, res, next) {
            try {
                const userID = req.params.userID;
                const userDel = await userModel.findOneAndDelete({ _id: userID, deleted: true });
                if(!userDel) throw createError.NotFound("User Not Found");
                return res.status(200).json({
                    message: "Delete User Successfully!",
                });
            } catch (error) {
                next(error);
            }
        },
    }
}

module.exports = userController