const User = require("../models/user.model");
const Address = require("../models/address_verification.model");

const { validationResult } = require("express-validator");
const Agent = require("../models/agent.model");

exports.get_all_customers = (req, res) => {
  User.find({ type: "customer" })
    .then((customers) =>
      res.status(200).json({ status: "success", message: customers }),
    )
    .catch();
};

exports.get_a_customer = (req, res) => {
  const { id } = req.params;
  User.find({ _id: id, type: "customer" })
    .then((customers) =>
      res.status(200).json({ status: "success", message: customers }),
    )
    .catch();
};

exports.update_customer_profile = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  const {
    email,
    companyName,
    regNo,
    tel,
    address,
    identity_price,
    address_price,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      user.email = email;
      user.companyName = companyName;
      user.regNo = regNo;
      user.tel = tel;
      user.address = address;
      user.identity_price = identity_price;
      user.address_price = address_price;
      user
        .save()
        .then(() =>
          res
            .status(202)
            .json({ status: "success", message: "User update successfull" }),
        )
        .catch((err) => {
          console.error({ err });
          res.status(400).json({
            status: "failed",
            message: `Profile cannot be updated.`,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        status: "failed",
        message: `Password change not successful.`,
      });
    });
};

exports.get_all_prof_ver = (req, res) => {
  const { identity_id } = req.params;

  Address.find({ identity_id: identity_id })
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
        message: "Cannot get verification.",
      });
    });
};

exports.get_all_ver_done_by_agent = (req, res) => {
  const { id } = req.params;

  Address.find({ completed_by: id })
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
        message: `Cannot get verification completed by ${id}.`,
      });
    });
};

exports.get_all_verification_in_a_location = (req, res) => {
  const { lga, state } = req.params;

  Address.find({ lga, state })
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
        message: `Cannot get verification completed at ${lga}, ${state}.`,
      });
    });
};

exports.get_all_verification_agents = (res) => {
  Agent.find()
    .then((agents) =>
      res.status(200).json({ status: "success", message: agents }),
    )
    .catch();
};
