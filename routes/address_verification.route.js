const express = require("express");
const router = express.Router();
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const Wallet = require("../utils/wallet_accounting");
const auth = require("../utils/customer_auth");
const Address = require("../models/address_verification.model");
const Analytics = require("../models/analytics.model");
const payment = require("../utils/payment");

// request a new address verification
router.post(
  "/",
  [
    body("user_id").isString().not().isEmpty().bail(),
    body("identity_id").isString().not().isEmpty().bail(),
    body("address").isString().not().isEmpty().bail(),
    body("lga").isString().not().isEmpty().bail(),
    body("state").isString().not().isEmpty().bail(),
    body("inform_about_visit").isString().not().isEmpty().bail(),
  ],
  auth,
  payment,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "failed", message: errors.array() });
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
  },
);

// get all address verification
router.get(
  "/",
  [body("user_id").isString().not().isEmpty().trim().bail()],
  auth,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "failed", message: errors.array() });
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
  },
);

// get all address verification related to a profile
router.get(
  "/profile/:identity_id",
  [body("user_id").isString().not().isEmpty().trim().bail()],
  auth,
  (req, res) => {
    // validation error reporting
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "failed", message: errors.array() });
    }

    const { user_id } = req.body;
    const { identity_id } = req.params;

    Address.find({ user_id: user_id, identity_id: identity_id })
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
  },
);

module.exports = router;
