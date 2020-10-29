const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const analytics_schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    user_id: { type: String, required: true },
    //transaction_history: [date, transaction type, transaction id, amount]
    transaction_history: { type: Array, required: true },
    number_of_identity_verification_ordered: { type: String, required: true },
    number_of_identity_verification_completed: { type: String, required: true },
    number_of_address_verification_ordered: { type: String, required: true },
    number_of_address_verification_completed: { type: String, required: true },
    identity_verification_price: { type: String, required: true },
    address_verification_price: { type: String, required: true },
    //wallet: wallet balance
    wallet: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Analytics = mongoose.model("analytics_schema", analytics_schema);

module.exports = Analytics;
