const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const agent_schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    tel: { type: Number, required: true },
    lga: { type: String, required: true },
    lga_state: { type: String, required: true },
    gender: { type: String, required: true },
    bvn: { type: Number, required: true },
    acount_number: { type: Number, required: true },
    account_name: { type: String, required: true },
    bank_name: { type: String, required: true },
    available_for_work: { type: Boolean, required: true },
    password: { type: String, required: true },
    address_verification_done: { type: Array, required: true }, //[date, verification_id, price]
    address_verification_count: { type: Number, required: true },
    address_verification_amount_due: { type: Number, required: true },
    address_verification_amount_paid: { type: Number, required: true },
  },
  { timestamps: true },
);

const Agent = mongoose.model("agent_schema", agent_schema);

module.exports = Agent;
