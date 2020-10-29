const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");

const Agent = require("../models/agent.model");
const Address = require("../models/address_verification.model");
const Analytics = require("../models/analytics.model");

const agent_controller = require("../controller/agent.controller");
const auth = require("../utils/others_auth");

const saltRounds = 10;

//create agent account
router.post(
  "/signup",
  // validate input
  [
    body("email").isEmail().trim(),
    body("password").isString().isLength({ min: 8 }).trim(),
    body("first_name").isString().trim().escape(),
    body("last_name").isString().trim().escape(),
    body("tel").isString().trim().escape(),
    body("address").isString().trim().escape(),
    body("gender").isString().trim().escape(),
    body("bvn").isString().trim().escape(),
    body("acount_number").isString().trim().escape(),
    body("account_name").isString().trim().escape(),
    body("bank_name").isString().trim().escape(),
  ],
  agent_controller.create_agent_account,
);

// Login
router.post(
  "/login",
  [body("email").isEmail().trim(), body("password").isString().trim()],
  auth,
  agent_controller.login,
);

// accept business verification
router.put(
  "/acceptverification/:id",
  auth,
  agent_controller.accept_business_verification,
);

//view accepted verification
router.get(
  "/verificationaccepted/",
  auth,
  agent_controller.accept_business_verification,
);

//complete a business verification.
router.put(
  "/complete/:id",
  [
    body("status").isString().trim().escape(),
    body("user_id").isString().trim(),
    body("note").isString().trim().escape(),
    body("long").isString().trim().escape(),
    body("lang").isString().trim().escape(),
    // body("picture_1").isString().trim().escape(),
    // body("picture_2").isString().trim().escape(),
    // body("picture_3").isString().trim().escape(),
    body("completed_by").isString().trim().escape(),
  ],
  auth,
  agent_controller.compelete_a_verification,
);

//view address verification ordered per lga.
router.get(
  "/lga/:lga/:state",
  auth,
  agent_controller.get_all_verification_in_a_location,
);

module.exports = router;
