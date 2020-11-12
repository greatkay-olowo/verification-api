const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, default: () => nanoid(10) },
    key: { type: String, required: true },
    companyName: { type: String, required: true, trim: true },
    regNo: { type: Number, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    tel: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    credit_check_price: { type: Number, required: true },
    identity_price: { type: Number, required: true },
    address_price: { type: Number, required: true },
}, {
    timestamps: true,
}, );

const User = mongoose.model('User', userSchema);

module.exports = User;