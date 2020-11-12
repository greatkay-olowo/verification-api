const { validationResult } = require('express-validator');
const moment = require('moment');

const Address = require('../models/address_verification.model');
const Analytics = require('../models/analytics.model');
const Company_Data = require('../models/company_data.model');
const User = require('../models/user.model');

const Wallet = require('../utils/wallet_accounting.js');

exports.request_new_add_ver = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    const {
        first_name,
        last_name,
        phone,
        address,
        lga,
        state,
        inform_about_visit,
        note,
    } = req.body;

    let { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            const price = user.address_price;
            const newAddress = new Address({
                user_id,
                first_name,
                last_name,
                phone,
                address,
                lga,
                state,
                agent_accepted: false,
                status: 'Pending',
                inform_about_visit,
                note,
                pictures: [],
                long: 0,
                lang: 0,
                date_requested: moment().format('YYYY-MM-DD'),
                completed_by: '',
                price,
            });

            newAddress
                .save()
                .then(() => {
                    Wallet.deduct_from_wallet(user_id, price, 'Address Verification');
                })
                .then(() => {
                    //update address verification ordered count on client's profile
                    Analytics.findOne({ user_id }).then((data) => {
                        data.num_of_address_ver_ordered += 1;
                        data.save();
                    });

                    //update address verification ordered count on company's database
                    Company_Data.findOne().then((data) => {
                        data.num_of_address_ordered += 1;
                        data.save();
                    });

                    res.status(202).json({
                        status: 'success',
                        message: 'Visit address ordered successfully.',
                    });
                })
                .catch((err) => {
                    console.error(err); //substitute for error reporting software
                    res.status(400).json({
                        status: 'failed',
                        message: 'Address verification cannot be added now.',
                    });
                });
        })
        .catch((err) => console.log(err));
};

exports.get_a_user_verifications = (req, res) => {
    const { user_id } = req.headers;

    Address.find({ user_id: user_id })
        .then((addresses) =>
            res.status(202).json({
                status: 'success',
                message: addresses,
            }),
        )
        .catch((err) => {
            console.error(err); //substitute for error reporting software
            res.status(400).json({
                status: 'failed',
                message: 'Cannot get all verification.',
            });
        });
};

exports.get_a_ver_for_a_user = (req, res) => {
    // validation error reporting
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    const { id } = req.params;

    Address.findById(id)
        .then((address) =>
            res.status(202).json({
                status: 'success',
                message: address,
            }),
        )
        .catch((err) => {
            console.error(err); //substitute for error reporting software
            res.status(400).json({
                status: 'failed',
                message: 'Cannot get verification.',
            });
        });
};