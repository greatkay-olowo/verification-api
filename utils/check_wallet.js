const Analytics = require("../models/analytics.model");
const User = require("../models/user.model");

exports.check_wallet_balance_for_address = (req, res, next) => {
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
exports.check_wallet_balance_for_identity = () => {
  let price = 0;
  let wallet_balance = 0;

  const { user_id } = req.headers;

  User.find({ _id: user_id })
    .then((user) => {
      price = parseInt(user.identity_price);
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
exports.check_wallet_balance_for_credit_check = () => {
  let price = 0;
  let wallet_balance = 0;

  const { user_id } = req.headers;

  User.find({ _id: user_id })
    .then((user) => {
      price = parseInt(user.credit_check_price);
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
