const mongoose = require('mongoose');

const nanoid = require('nanoid');

const Schema = mongoose.Schema;

const address_schema = new Schema({
    _id: { type: String, default: () => nanoid(10) },
    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    lga: { type: String, required: true },
    state: { type: String, required: true },
    agent_accepted: { type: Boolean, required: true },
    status: { type: String, required: true },
    inform_about_visit: { type: Boolean, required: true },
    note: { type: String, required: true },
    pictures: { type: Array, required: true },
    long: { type: Number, required: true },
    lang: { type: Number, required: true },
    date_requested: { type: Date, required: true },
    date_completed: { type: Date, required: true },
    completed_by: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true }, );

const Address = mongoose.model('address_schema', address_schema);

module.exports = Address;