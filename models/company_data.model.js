const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Schema = mongoose.Schema;

const company_data_schema = new Schema({
    _id: { type: String, default: () => nanoid(10) },
    number_of_customers: { type: Number, required: true },
    //all_payments: [date, amount, transaction type, timestamp]
    all_payments: { type: Array, required: true },
    num_of_identity: { type: Number, required: true },
    num_of_address_ordered: { type: Number, required: true },
    num_of_address: { type: Number, required: true },
    num_of_credit_check: { type: Number, required: true },
    account_balance_wallet: { type: Number, balancerequired: true },
    num_of_agents: { type: Number, balancerequired: true },
}, {
    timestamps: true,
}, );

const Company_Data = mongoose.model('Company_Data', company_data_schema);

module.exports = Company_Data;