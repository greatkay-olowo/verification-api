const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const address_schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    user_id: { type: String, required: true },
    agent_accepted: { type: Boolean, required: true },
    identity_id: { type: String, required: true },
    status: { type: String, required: true },
    address: { type: String, required: true },
    lga: { type: String, required: true },
    state: { type: String, required: true },
    inform_about_visit: { type: String, required: true },
    note: { type: String, required: true },
    pictures: { type: Array, required: true },
    long: { type: String, required: true },
    lang: { type: String, required: true },
    date_requested: { type: String, required: true },
    date_completed: { type: String, required: true },
    completed_by: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true },
);

const Address = mongoose.model("address_schema", address_schema);

module.exports = Address;
