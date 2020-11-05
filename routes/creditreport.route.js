const express = require('express');
const router = express.Router();

const check_wallet = require('../utils/check_wallet');
const auth = require('../utils/auth');
const credit_report = require('../controller/credit_report.controller');

const { body } = require('express-validator');

//get an identity report
router.post(
    '/', [
        body('identification_type').isString().trim(),
        body('identification_first_name').isString().trim(),
        body('identification_last_name').isString().trim(),
        body('identification_middle_name').isString().trim(),
        body('identification_bvn').isString().trim(),
        body('identification_dob').isString().trim(),
        body('identification_phone_numbers').isArray().trim(),
    ],
    auth.customer_auth,
    check_wallet.check_wallet_balance_for_credit_check,
    credit_report.spool_credit_report,
);

module.exports = router;