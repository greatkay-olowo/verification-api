const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Address = require('../models/address_verification.model');
const Staff = require('../models/staff.model');

const { validationResult } = require('express-validator');
const Agent = require('../models/agent.model');

const saltRounds = 10;

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    let { email, password, right } = req.body;
    email = email.toLowerCase();

    Staff.findOne({ email })
        .then((staff) => {
            if (staff !== null) {
                res
                    .status(401)
                    .json({ status: 'failed', message: `${email} already taken.` });
            } else {
                bcrypt.hash(password, saltRounds).then((hash) => {
                    const newStaff = new Staff({
                        email,
                        password: hash,
                        right,
                    });
                    newStaff
                        .save()
                        .then(() => {
                            res.status(202).json({ status: 'success', message: 'Staff registered' });
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(400).json({
                                status: 'failed',
                                message: 'Staff registration not successful.',
                            });
                        });
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({
                status: 'failed',
                message: 'Staff registration not successful. ',
            });
        });
};

exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    let { email, password } = req.body;
    email = email.toLowerCase();

    Staff.findOne({ email }).then((staff) => {
        if (staff.length === 0) {
            res.status(404).json({ status: 'failed', message: 'Account not found.' });
        } else {
            if (bcrypt.compare(password, staff.password)) {
                res.status(202).json({
                    status: 'success',
                    message: [staff._id],
                });
            } else {
                res.status(400).json({ status: 'failed', message: 'Login not correct.' });
            }
        }
    });
};

exports.get_all_customers = (req, res) => {
    User.find({ type: 'customer' })
        .then((customers) =>
            res.status(200).json({ status: 'success', message: customers }),
        )
        .catch((err) => console.log(err));
};

exports.get_a_customer = (req, res) => {
    const { id } = req.params;
    User.find({ _id: id, type: 'customer' })
        .then((customers) =>
            res.status(200).json({ status: 'success', message: customers }),
        )
        .catch((err) => console.log(err));
};

exports.update_customer_profile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failed', message: errors.array() });
    }

    const {
        email,
        companyName,
        regNo,
        tel,
        address,
        identity_price,
        address_price,
        credit_check_price,
    } = req.body;
    User.findOne({ email })
        .then((user) => {
            user.email = email;
            user.companyName = companyName;
            user.regNo = regNo;
            user.tel = tel;
            user.address = address;
            user.identity_price = identity_price;
            user.address_price = address_price;
            user.credit_check_price = credit_check_price;
            user
                .save()
                .then(() =>
                    res
                    .status(202)
                    .json({ status: 'success', message: 'User update successfull' }),
                )
                .catch((err) => {
                    console.error({ err });
                    res.status(400).json({
                        status: 'failed',
                        message: `Profile cannot be updated.`,
                    });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({
                status: 'failed',
                message: `Password change not successful.`,
            });
        });
};

exports.get_all_verification = (req, res) => {
    Address.find()
        .then((addresses) => {
            res.status(202).json({ status: 'success', message: addresses });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                status: 'failed',
                messgae: 'All verification cannot be gotten at the moment.',
            });
        });
};

exports.get_one_verification = (req, res) => {
    const { id } = req.params;
    Address.findById(id)
        .then((address) => {
            res.status(202).json({ status: 'success', message: address });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                status: 'failed',
                messgae: 'All verification cannot be gotten at the moment.',
            });
        });
};

exports.get_all_add_ver_for_a_user = (req, res) => {
    const { user_id } = req.params;

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
                message: 'Cannot get verification.',
            });
        });
};

exports.get_all_verification_accepted_by_an_agent = (req, res) => {
    const { agent_id } = req.params;

    Address.find({ completed_by: agent_id, agent_accepted: true })
        .then((addresses) => {
            res.status(202).json({
                status: 'success',
                message: addresses,
            });
        })
        .catch((err) => {
            console.error(err); //substitute for error reporting software
            res.status(400).json({
                status: 'failed',
                message: `Cannot get verification completed by ${id}.`,
            });
        });
};

/////////////////////
exports.get_all_ver_done_by_agent = (req, res) => {
    const { agent_id } = req.params;

    Address.find({ completed_by: agent_id })
        .then((addresses) => {
            const list = addresses.filter((address) => address.status !== 'Pending');

            res.status(202).json({
                status: 'success',
                message: list,
            });
        })
        .catch((err) => {
            console.error(err); //substitute for error reporting software
            res.status(400).json({
                status: 'failed',
                message: `Cannot get verification completed by ${id}.`,
            });
        });
};

exports.get_all_verification_in_a_location = (req, res) => {
    const { lga, state } = req.params;

    Address.find({ lga, state })
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

exports.get_all_verification_agents = (req, res) => {
    Agent.find()
        .then((agents) =>
            res.status(200).json({ status: 'success', message: agents }),
        )
        .catch((err) => console.log(err));
};

exports.get_a_verification_agent = (req, res) => {
    const { agent_id } = req.params;
    Agent.findById(agent_id)
        .then((agent) => res.status(200).json({ status: 'success', message: agent }))
        .catch((err) => console.log(err));
};