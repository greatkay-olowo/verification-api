const Analytics = require("../models/analytics.model");
const moment = require("moment");

exports.deduct_from_wallet = (
  user_id,
  amount,
  transaction_type,
  transaction_id,
) => {
  Analytics.findOne({ user_id })
    .then((user) => {
      const previous_balance = parseInt(user.wallet);
      const charge = parseInt(amount);

      // check balance
      if (previous_balance < 0 || previous_balance < charge) {
        res.status().json({
          status: "failed",
          message: "Insifficient fund in wallet. Please top up your account.",
        });
        return;
      }

      //deduct amount from balance
      const new_balance = previous_balance - charge;
      user.wallet = new_balance;

      // add transaction to history
      const transaction = {
        date: moment().format("DD-MM-YYYY"),
        transaction_type,
        transaction_id,
        charge,
      };
      user.transaction.push(transaction);
      user.markModified();
      user.save().catch((err) => {
        console.error(err); //substitute for error reporting software
        res.status(400).json({
          status: "failed",
          message: "Error while trying to deduct fund from wallet.",
        });
      });
    })
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Error while trying to deduct fund from wallet.",
      });
    });
};

exports.add_to_wallet = () => {};

exports.add_count_to_address_verification_number = (user_id) => {
  Analytics.findOne({ user_id })
    .then((account) => {
      let number_of_address_ver = parseInt(
        account.number_of_address_verification,
      );
      number_of_address_ver += 1;
      account.number_of_address_verification = number_of_address_ver;
      account.save();
    })
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Error while increamenting address verification number.",
      });
    });
};

exports.add_count_to_identity_verification_number = (user_id) => {
  Analytics.findOne({ user_id })
    .then((account) => {
      let number_of_address_ver = parseInt(
        account.number_of_identity_verification,
      );
      number_of_identity_ver += 1;
      account.number_of_identity_verification = number_of_identity_ver;
      account.save();
    })
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Error while increamenting address verification number.",
      });
    });
};
