const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const moment = require('moment');

const Agent = require('../models/agent.model');
const Address = require('../models/address_verification.model');
const User = require('../models/agent.model');
const Company_Data = require('../models/company_data.model');
const Wallet = require('../utils/wallet_accounting');

const image_upload = require('../utils/image_upload');

const saltRounds = 10;

exports.create_agent_account = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    let {
        email,
        password,
        first_name,
        last_name,
        tel,
        lga,
        state,
        gender,
        bvn,
        acount_number,
        account_name,
        bank_name,
    } = req.body;
    email = email.toLowerCase();

    Agent.findOne({ email })
        .then((agent) => {
            if (agent !== null) {
                console.log(agent);
                res.status(401).json({
                    status: 'failed',
                    message: `staff email ${email} already taken.`,
                });
            } else {
                bcrypt.hash(password, saltRounds).then((hash) => {
                    const newAgent = new User({
                        email,
                        password: hash,
                        first_name,
                        last_name,
                        tel,
                        lga,
                        state,
                        gender,
                        bvn,
                        acount_number,
                        account_name,
                        bank_name,
                        available_for_work: false,
                        address_verification_count: 0,
                        address_verification_amount_due: 0,
                        address_verification_amount_paid: 0,
                    });
                    newAgent
                        .save()
                        .then(() => {
                            Company_Data.findOne()
                                .then((data) => {
                                    data.num_of_agents += 1;
                                    data.save();
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(400).json({
                                        status: 'failed',
                                        message: 'failed to add agent count to company data.',
                                    });
                                });
                            res.status(202).json({ status: 'success', message: 'Agent registered' });
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(400).json({
                                status: 'failed',
                                message: 'Agent registration not successful.',
                            });
                        });
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({
                status: 'failed',
                message: 'Agent registration not successful. ',
            });
        });
};

exports.login = (req, res) => {
    let { email, password } = req.headers;
    email = email.toLowerCase();

    Agent.findOne({ email })
        .then((agent) => {
            if (agent === null) {
                res.status(404).json({ status: 'failed', message: 'Account not found.' });
            } else {
                if (bcrypt.compare(password, agent.password)) {
                    res.status(202).json({
                        status: 'success',
                        message: { id: agent._id },
                    });
                } else {
                    res.status(400).json({ status: 'failed', message: 'Login not correct.' });
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ status: 'failed', message: `Login not successful.` });
        });
};

exports.accept_business_verification = (req, res) => {
    const { id } = req.params;
    Address.findById(id)
        .then((address) => {
            address.agent_accepted = true;
            address.completed_by = id;
            address.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Verification accepted.',
                });
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({
                status: 'failed',
                message: 'Cannot accept verication right now.',
            });
        });
};

exports.get_all_accepted_verification_by_an_agent = (req, res) => {
    const { id } = req.params;

    Address.find({ agent_accepted: true, completed_by: id })
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
                message: `Cannot get verification completed.`,
            });
        });
};

exports.get_all_accepted_verification_by_all_agents = (req, res) => {
    const { id } = req.params;

    Address.find({ agent_accepted: true })
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
                message: `Cannot get verification completed.`,
            });
        });
};

exports.compelete_a_verification = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    const { status, note, long, lang, user_id, completed_by, pictures } = req.body;
    const { id } = req.params;
    const date = moment().format('YYYY-MM-DD');
    // const images = image_upload.image_validation_and_upload;
    let price = 3;

    Address.findOne({ user_id: user_id })
        .then((address) => {
            // status can either be 'completed' or 'failed'
            address.status = status;
            address.note = note;
            address.long = long;
            address.lang = lang;
            address.pictures = pictures;
            address.date_completed = date;
            address.completed_by = completed_by; //verification officer staff id
            price = address.price;
            address.markModified('pictures');
            address
                .save()
                .then((address) => {
                    const charge = price;

                    Wallet.deduct_from_wallet(user_id, charge, 'address verification', id);

                    Wallet.add_count_to_address_ver_num(user_id);

                    Agent.findById(completed_by)
                        .then((agent) => {
                            agent.address_verification_done.push({ date, id, price });
                            agent.address_verification_amount_due += charge;
                            agent.markModified('address_verification_done');
                            agent.save();
                            res.status(202).json({
                                status: 'success',
                                message: address,
                            });
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => {
                    console.error(err); //substitute for error reporting software
                    res.status(400).json({
                        status: 'failed',
                        message: 'Error while trying to save verification.',
                    });
                });
        })
        .catch((err) => {
            console.error(err); //substitute for error reporting software
            res.status(400).json({
                status: 'failed',
                message: 'Error while trying to save verification.',
            });
        });
};

exports.get_all_verification_in_a_location_not_accptd_by_any_agent = (
    req,
    res,
) => {
    const { lga, state } = req.params;

    Address.find({ lga, state, agent_accepted: false })
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
                message: `Cannot get verification completed at ${lga}, ${state}.`,
            });
        });
};