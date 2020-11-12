const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Agent = require('../models/agent.model');
const Staff = require('../models/staff.model');

exports.customer_auth = (req, res, next) => {
    const { key, user_id } = req.headers;

    if (!key) {
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
        .catch((err) => console.log(err));
};

exports.agent_auth = (req, res, next) => {
    const { email, password } = req.headers;
    if (!email || !password) {
        return res
            .status(403)
            .json({ status: 'failed', error: 'Login credentials not sent' });
    }
    Agent.findOne({ email })
        .then((agent) => {
            if (agent !== null) {
                if (bcrypt.compare(password, agent.password)) {
                    return next();
                } else {
                    return res
                        .status(403)
                        .json({ status: 'failed', error: 'Incorrect login details!' });
                }
            } else {
                res
                    .status(403)
                    .json({ status: 'failed', error: 'Incorrect login details!' });
            }
        })
        .catch((err) => console.log(err));
};

exports.staff_auth = (req, res, next) => {
    const { email, password } = req.headers;
    if (!email || !password) {
        return res
            .status(403)
            .json({ status: 'failed', error: 'Login credentials not sent' });
    }
    Staff.findOne({ email })
        .then((staff) => {
            if (bcrypt.compare(password, staff.password)) {
                return next();
            } else {
                return res
                    .status(403)
                    .json({ status: 'failed', error: 'Incorrect login details!' });
            }
        })
        .catch((err) => console.log(err));
};