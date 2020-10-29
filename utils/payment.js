const Analytics = require("../models/analytics.model");
const User = require("../models/user.model");

const check_account_balance = (req, res, next) => {
  let price = 0;
  let wallet_balance = 0;

  const { user_id } = req.headers;

  User.find({ _id: user_id })
    .then((user) => {
      price = parseInt(user.address_verification_price);
    })
    .catch();

  Analytics.find({ _id: user_id })
    .then((user) => {
      wallet_balance = parseInt(user.wallet_balance);
    })
    .catch();

  if (wallet_balance <= price && wallet_balance !== 0) {
    next();
  } else {
    res
      .status(402)
      .json({ status: "failed", message: "Insufficient banalce." });
  }
};

module.exports = check_account_balance;
