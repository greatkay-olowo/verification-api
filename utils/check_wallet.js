const Analytics = require('../models/analytics.model');
const User = require('../models/user.model');

exports.check_wallet_balance_for_address = (req, res, next) => {
    let price = 0;
    let wallet_balance = 0;

    const { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            price = user.address_price;
            Analytics.findOne({ user_id })
                .then((user_analytics) => {
                    wallet_balance = user_analytics.wallet;
                    if (wallet_balance >= price) {
                        return next();
                    } else {
                        res
                            .status(402)
                            .json({ status: 'failed', message: 'Insufficient banalce.' });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};
exports.check_wallet_balance_for_identity = () => {
    let price = 0;
    let wallet_balance = 0;

    const { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            price = user.identity_price;
            Analytics.findOne({ user_id })
                .then((user_analytics) => {
                    wallet_balance = user_analytics.wallet;
                    if (wallet_balance >= price) {
                        next();
                    } else {
                        res
                            .status(402)
                            .json({ status: 'failed', message: 'Insufficient banalce.' });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};
exports.check_wallet_balance_for_credit_check = () => {
    let price = 0;
    let wallet_balance = 0;

    const { user_id } = req.headers;

    User.findById(user_id)
        .then((user) => {
            price = user.credit_check_price;
            Analytics.findOne({ user_id })
                .then((user_analytics) => {
                    wallet_balance = user_analytics.wallet;
                    if (wallet_balance >= price) {
                        next();
                    } else {
                        res
                            .status(402)
                            .json({ status: 'failed', message: 'Insufficient banalce.' });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};