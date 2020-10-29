const express = require("express");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const moment = require("moment");

const Agent = require("../models/agent.model");
const Address = require("../models/address_verification.model");
const Analytics = require("../models/analytics.model");

const saltRounds = 10;

exports.create_agent_account = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  let {
    email,
    password,
    first_name,
    last_name,
    tel,
    address,
    gender,
    bvn,
    acount_number,
    account_name,
    bank_name,
  } = req.body;
  email = email.toLowerCase();

  Agent.find({ email })
    .then((agent) => {
      if (agent.length !== 0) {
        res
          .status(401)
          .json({ status: "failed", message: `${email} already taken.` });
      } else {
        bcrypt.hash(password, saltRounds).then((key) => {
          const newAgent = new User({
            email,
            password: hash,
            first_name,
            last_name,
            tel,
            address,
            gender,
            bvn,
            acount_number,
            account_name,
            bank_name,
          });
          newAgent
            .save()
            .then(() => {
              res
                .status(202)
                .json({ status: "success", message: "Agent registered" });
            })
            .catch((err) => {
              console.error(err);
              res.status(400).json({
                status: "failed",
                message: "Agent registration not successful.",
              });
            });
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        status: "failed",
        message: "Agent registration not successful. ",
      });
    });
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  let { email, password } = req.body;
  email = email.toLowerCase();

  Agent.findOne({ email })
    .then((agent) => {
      if (agent.length === 0) {
        res
          .status(404)
          .json({ status: "failed", message: "Account not found." });
      } else {
        if (bcrypt.compare(password, agent.password)) {
          res.status(202).json({
            status: "success",
            message: [
              agent.agent._id,
              agent.email,
              agent.first_name,
              agent.last_name,
              agent.tel,
              agent.address,
              agent.gender,
              agent.bvn,
              agent.acount_number,
              agent.account_name,
              agent.bank_name,
              agent.available_for_work,
              agent.address_verification_count,
              agent.address_verification_amount_due,
              agent.address_verification_amount_paid,
            ],
          });
        } else {
          res
            .status(400)
            .json({ status: "failed", message: "Login not correct." });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ status: "failed", message: `Login not successful.` });
    });
};

exports.accept_business_verification = (req, res) => {
  const { id } = req.params;

  Address.findOne({ _id: id })
    .then((address) => {
      address.agent_accepted = true;
      address.save().then(() => {
        res.status(200).json({
          status: "success",
          message: "Verification accepted.",
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        status: "failed",
        message: "Cannot accept verication right now.",
      });
    });
};

exports.get_all_accepted_verification = (res) => {
  Address.find({ agent_accepted: true })
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
        message: `Cannot get verification completed.`,
      });
    });
};

exports.compelete_a_verification = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  const {
    status,
    note,
    long,
    lang,
    picture_1,
    picture_2,
    picture_3,
    user_id,
    completed_by,
  } = req.body;
  const { id } = req.params;
  const date = moment().format("DD-MM-YYYY");
  Address.findOne({ user_id: user_id, _id: id })
    .then((address) => {
      address.status = status;
      address.note = note;
      address.long = long;
      address.lang = lang;
      address.picture_1 = picture_1;
      address.picture_2 = picture_2;
      address.picture_3 = picture_3;
      address.date_completed = date;
      address.completed_by = completed_by; //verification officer staff id
      address
        .save()
        .then(() => {
          Analytics.findOne({ user_id: user_id })
            .then((account) => {
              const charge = parseInt(account.address_verification_price);
              Wallet.deduct_from_wallet(
                user_id,
                charge,
                "address verification",
                id,
              );
              Wallet.add_count_to_address_verification_number(user_id);
              Agent.findById({ _id: completed_by })
                .then((agent) => {
                  agent.address_verification_done.push([
                    date,
                    verification_id,
                    price,
                  ]);
                })
                .catch();
            })
            .catch((err) => {
              console.error(err); //substitute for error reporting software
              res.status(400).json({
                status: "failed",
                message: "Error while trying to save verification.",
              });
            });
          res.status(202).json({
            status: "success",
            message: addresses,
          });
        })
        .catch((err) => {
          console.error(err); //substitute for error reporting software
          res.status(400).json({
            status: "failed",
            message: "Error while trying to save verification.",
          });
        });
    })
    .catch((err) => {
      console.error(err); //substitute for error reporting software
      res.status(400).json({
        status: "failed",
        message: "Error while trying to save verification.",
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
