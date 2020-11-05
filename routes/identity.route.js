const express = require('express');
const router = express.Router();

const check_wallet = require('../utils/check_wallet');
const auth = require('../utils/auth');
const identity_controller = require('../controller/identity.controller');

const { body } = require('express-validator');

//get an identity report
router.post(
    '/', [
        body('identification_type').isString().trim(),
        body('identification_number').isString().trim(),
        body('identification_name').isString().trim(),
        body('identification_dob').isString().trim(),
    ],
    auth.customer_auth,
    check_wallet.check_wallet_balance_for_identity,
    identity_controller.verify_identity,
);

module.exports = router;