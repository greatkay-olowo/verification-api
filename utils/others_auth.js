const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const others_auth = (req, res, next) => {
    const { email, password } = req.body;

    //   User.findOne({ email })
    //     .then((user) => {
    //       if (bcrypt.compare(password, user.password)) {
    //         return next();
    //       } else {
    //         return res
    //           .status(403)
    //           .json({ status: "failed", error: "Incorrect login details!" });
    //       }
    //     })
    //     .catch();
    return next(); //remove this to enable auth and uncomment above
};

module.exports = others_auth;