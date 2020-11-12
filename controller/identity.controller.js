const { validationResult } = require('express-validator');

const Wallet = require('../utils/wallet_accounting');

const identity_api_call = require('../utils/carbon');

const User = require('../models/user.model');

exports.verify_identity = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }
    // Type of verification. Can be bvn, driverlicence, passport, voterid, nationalid, nimcslip, cac, tin
    // const identification_dob:  (format YYYY-MM-DD)
    const {
        identification_type,
        identification_number,
        identification_name,
        identification_dob,
    } = req.body;

    const requestObject = {
        identification_type,
        identification_number,
        identification_name,
        identification_dob,
    };
    const { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            const price = user.address_price;

            try {
                const response = identity_api_call(requestObject);
                Wallet.deduct_from_wallet(user_id, price, identification_type);
                Wallet.add_count_to_identity_verification_number(user_id);
                res.status(200).json({ status: 'success', message: response });
            } catch (err) {
                console.log(err);
            }
        })
        .catch((err) => console.log(err));
};