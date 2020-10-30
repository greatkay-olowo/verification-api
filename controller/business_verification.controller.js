const { validationResult } = require("express-validator");
const moment = require("moment");

const Address = require("../models/address_verification.model");
const Analytics = require("../models/analytics.model");

const Wallet = require("../utils/wallet_accounting");

exports.request_new_add_ver = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  const {
    user_id,
    identity_id,
    address,
    lga,
    state,
    inform_about_visit,
  } = req.body;

  const newAddress = new Address({
    user_id,
    identity_id,
    address,
    lga,
    state,
    inform_about_visit,
    note,
    status: "Pending",
    pictures: [],
    long: "",
    lang: "",
    date_requested: moment().format("DD-MM-YYYY"),
    date_completed: "",
    completed_by: "",
    price,
    agent_accepted: false,
  });

  newAddress
    .save()
    .then(() => {
      console.log("Payment handled"); // handle payment
    })
    .then(() => {
      Analytics.find().then((data) => {
        data.number_of_identity_verification_ordered = (parseInt(
          data.number_of_identity_verification_ordered,
        ) += 1).toString();
      });
      res.status(202).json({
        status: "success",
        message: "Visit address ordered successfully.",
      });
    })
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Address verification cannot be added now.",
      });
    });
};

exports.get_a_user_verifications = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  const { user_id } = req.body;

  Address.find({ user_id: user_id })
    .then((addresses) =>
      res.status(202).json({
        status: "success",
        message: addresses,
      }),
    )
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Cannot get all verification.",
      });
    });
};

exports.get_a_ver_for_a_user = (req, res) => {
  // validation error reporting
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  const { user_id } = req.body;
  const { id } = req.params;

  Address.findOne({ user_id: user_id, _id: id })
    .then((address) =>
      res.status(202).json({
        status: "success",
        message: address,
      }),
    )
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Cannot get verification.",
      });
    });
};
