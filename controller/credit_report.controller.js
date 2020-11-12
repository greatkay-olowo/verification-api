const { validationResult } = require('express-validator');

const Wallet = require('../utils/wallet_accounting');

const identity_api_call = require('../utils/carbon');

const User = require('../models/user.model');

exports.spool_credit_report = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }
    // Type of verification.Must be set to credit
    //  identification_dob:  (format YYYY-MM-DD)
    // identification_phone_numbers: string[]

    const {
        identification_type,
        identification_first_name,
        identification_last_name,
        identification_middle_name,
        identification_bvn,
        identification_dob,
        identification_phone_numbers,
    } = req.body;

    const requestObject = {
        identification_type,
        identification_first_name,
        identification_last_name,
        identification_middle_name,
        identification_bvn,
        identification_dob,
        identification_phone_numbers,
    };
    const { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            const price = user.address_price;

            try {
                const response = identity_api_call(requestObject);
                Wallet.deduct_from_wallet(user_id, price, identification_type);
                Wallet.add_count_to_credit_report_number(user_id);
                res.status(200).json({ status: 'success', message: response });
            } catch (err) {
                console.log(err);
            }
        })
        .catch((err) => console.log(err));
};