const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Agent = require('../models/agent.model');
const Staff = require('../models/staff.model');

exports.customer_auth = (req, res, next) => {
    const key = req.headers.authorization;
    const user_id = req.headers.user_id;
    if (!req.headers.authorization) {
        return res.status(403).json({ status: 'failed', error: 'No keys sent!' });
    }
    User.findById(user_id)
        .then((user) => {
            if (key === user.key) {
                return next();
            } else {
                return res.status(403).json({ status: 'failed', error: 'Incorrect Keys!' });
            }
        })
        .catch();
};

exports.agent_auth = (req, res, next) => {
    const { email, password } = req.body;
};

exports.staff_auth = () => {};