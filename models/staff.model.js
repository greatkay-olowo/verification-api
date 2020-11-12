const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Schema = mongoose.Schema;

const staff_schema = new Schema({
    _id: { type: String, default: () => nanoid(10) },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    right: { type: String, required: true },
}, {
    timestamps: true,
}, );

const Staff = mongoose.model('Staff', staff_schema);

module.exports = Staff;