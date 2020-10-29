const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const company_data_schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    number_of_customers: { type: String, required: true },
    //all_payments: [date, transaction type, transaction id, amount]
    all_payments: { type: Array, required: true },
    number_of_identity_verification: { type: String, required: true },
    number_of_address_verification: { type: String, required: true },
    account_balance_wallet: { type: String, balancerequired: true },
  },
  {
    timestamps: true,
  },
);

const Company_Data = mongoose.model("company_data_schema", company_data_schema);

module.exports = Company_Data;
