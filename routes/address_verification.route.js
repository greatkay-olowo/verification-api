const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../utils/customer_auth");
const payment = require("../utils/check_wallet");

const address = require("../controller/business_verification.controller");

// request a new address verification
router.post(
    "/", [
        body("user_id").isString().trim().escape(),
        body("first_name").isString().trim().escape(),
        body("last_name").isString().trim().escape(),
        body("phone").isInt().not().isEmpty().bail(),
        body("address").isString().trim().escape(),
        body("lga").isString().trim().escape(),
        body("state").isString().trim().escape(),
        body("inform_about_visit").isBoolean(),
        body("note").isString().trim().escape(),
    ],
    auth,
    payment.check_wallet_balance_for_address,
    address.request_new_add_ver,
);

// get all address verification for a user
router.get(
    "/", [body("user_id").isString().not().isEmpty().trim().bail()],
    auth,
    address.get_a_user_verifications,
);

// get a address verification for a user
router.get(
    "/:id", [body("user_id").isString().not().isEmpty().trim().bail()],
    auth,
    address.get_a_ver_for_a_user,
);

module.exports = router;