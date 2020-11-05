const User = require('../models/user.model');

exports.address = (user_id) => {
    User.findById(user_id).then((user) => {
        return user.address_price;
    });
};

exports.identity = (user_id) => {
    User.findById(user_id).then((user) => {
        return user.identity_price;
    });
};

exports.credit = (user_id) => {
    User.findById(user_id).then((user) => {
        return user.credit_check_price;
    });
};