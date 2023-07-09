const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, minLength: 6, maxLength: 24 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, default: 'regular' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);