const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const analytics_schema = new Schema({
    _id: { type: String, default: () => nanoid(10) },
    user_id: { type: String, required: true },
    //transaction_history: [date, amount, transaction type, timestamp]
    transaction_history: { type: Array, required: true },
    num_of_identity_ver_completed: { type: Number, required: true },
    num_of_address_ver_ordered: { type: Number, required: true },
    num_of_address_ver_completed: { type: Number, required: true },
    num_of_credit_check_completed: { type: Number, required: true },
    //wallet: wallet balance
    wallet: { type: Number, required: true },
}, {
    timestamps: true,
}, );

const Analytics = mongoose.model("analytics_schema", analytics_schema);

module.exports = Analytics;