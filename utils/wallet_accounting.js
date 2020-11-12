const Analytics = require('../models/analytics.model');
const Company_Data = require('../models/company_data.model');
const Agent = require('../models/agent.model');
const moment = require('moment');

const error = require('../utils/error');

/**
 * @module
 * @name Wallet_Accounting - Add, deduct funds from client wallet and pool wallet.
 * @requires  '../models/analytics.model'
 * @requires '../models/company_data.model'
 * @requires moment
 */

/**
 * Deduct Amount from Client Wallet
 * @param {string} user_id - user id
 * @param {number} charge - The amount to be deducted from the wallet
 * @param {string} transaction_type - the type of transaction that is being carried out
 * @returns {void}
 */
exports.deduct_from_wallet = (user_id, charge, transaction_type, id, res) => {
    Analytics.findOne({ user_id }).then((user) => {
        Company_Data.findOne()
            .then((company_data) => {
                const previous_balance = user.wallet;
                // check balance
                if (previous_balance < charge) {
                    res.status().json({
                        status: 'failed',
                        message: 'Insifficient fund in wallet. Please top up your account.',
                    });
                    return;
                }

                //deduct amount from balance
                user.wallet -= charge;

                // add transaction to history
                const transaction = {
                    date: moment().format('YYYY-MM-DD'),
                    transaction_type: transaction_type,
                    timestamp: Date.now().toString(),
                    amount: charge,
                    transaction_id: id,
                };
                user.transaction_history.push(transaction);

                // add transaction to company database
                company_data.all_payments.push({
                    date: moment().format('YYYY-MM-DD'),
                    transaction_type: transaction_type,
                    timestamp: Date.now().toString(),
                    amount: charge,
                    user_id: user_id,
                    transaction_id: id,
                });
                company_data.account_balance_wallet -= charge; //deduct from company's wallet

                user.markModified('all_payments');
                user.save();
                //save company wide database
                company_data.markModified('all_payments');
                company_data.save();
            })
            .catch((err) => {
                console.error(err); //substitute for error reporting software
                res.status(400).json({
                    status: 'failed',
                    message: 'Error while trying to deduct fund from wallet.',
                });
            });
    });
};

exports.add_to_wallet = () => {};

exports.add_count_to_address_ver_num = (user_id, res) => {
    Analytics.findOne({ user_id }).then((account) => {
        Company_Data.findOne()
            .then((data) => {
                account.num_of_address_ver_completed += 1;
                account.save();
                data.num_of_address += 1;
                data.save();
            })
            .catch((err) => {
                console.error(err); //substitute for error reporting software
                res.status(400).json({
                    status: 'failed',
                    message: 'Error while increamenting address verification number.',
                });
            });
    });
};

exports.add_count_to_identity_verification_number = (user_id, res) => {
    Analytics.findOne({ user_id }).then((account) => {
        Company_Data.find()
            .then((data) => {
                account.num_of_identity_ver_completed += 1;
                account.save();
                data.num_of_identity += 1;
                data.save();
            })
            .catch((err) => {
                console.error(err); //substitute for error reporting software
                res.status(400).json({
                    status: 'failed',
                    message: 'Error while increamenting address verification number.',
                });
            });
    });
};

exports.add_count_to_credit_report_number = (user_id, res) => {
    Analytics.findOne({ user_id }).then((account) => {
        Company_Data.find()
            .then((data) => {
                account.num_of_credit_check_completed += 1;
                account.save();
                data.num_of_credit_check += 1;
                data.save();
            })
            .catch((err) => {
                console.error(err); //substitute for error reporting software
                res.status(400).json({
                    status: 'failed',
                    message: 'Error while increamenting address verification number.',
                });
            });
    });
};