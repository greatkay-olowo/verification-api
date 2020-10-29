const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const auth = (req, res, next) => {
  const pass = req.headers.authorization;
  const user_id = req.headers.user_id;
  if (!req.headers.authorization) {
    return res.status(403).json({ status: "failed", error: "No keys sent!" });
  }
  // User.findOne({ _id: user_id })
  //   .then((user) => {
  //     if (key === user.key) {
  //       return next();
  //     } else {
  //       return res
  //         .status(403)
  //         .json({ status: "failed", error: "Incorrect Keys!" });
  //     }
  //   })
  //   .catch();
  return next(); //remove this to enable auth and uncomment above
};

module.exports = auth;
