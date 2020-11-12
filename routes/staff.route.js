const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const staff_controller = require('../controller/staff.controller');
const agent_controller = require('../controller/agent.controller');

const auth = require('../utils/auth');

router.post(
    '/signup', [
        body('email').isEmail().trim(),
        body('password').isString().isLength({ min: 8 }).trim(),
        body('right').isString().escape().trim(),
    ],
    staff_controller.signup,
);

router.post(
    '/login', [
        body('email').isEmail().trim(),
        body('password').isString().isLength({ min: 8 }).trim(),
    ],
    auth.staff_auth,
    staff_controller.login,
);

router.get('/customers', auth.staff_auth, staff_controller.get_all_customers);

router.get('/customer/:id', auth.staff_auth, staff_controller.get_a_customer);

router.put(
    '/customer/:id', [
        body('email').isEmail().trim(),
        body('companyName').isString().trim().escape(),
        body('regNo').isInt().trim().escape(),
        body('tel').isString().trim().escape(),
        body('address').isString().trim().escape(),
        body('identity_price').isInt().trim().escape(),
        body('address_price').isInt().trim().escape(),
        body('credit_check_price').isInt().trim().escape(),
    ],
    auth.staff_auth,
    staff_controller.update_customer_profile,
);

// get all address verification
router.get('/address', auth.staff_auth, staff_controller.get_one_verification);

// get one address verification
router.get(
    '/address/:id',
    auth.staff_auth,
    staff_controller.get_all_verification,
);

// get all address verification related to a customer
router.get(
    '/customer/address/:user_id',
    auth.staff_auth,
    staff_controller.get_all_add_ver_for_a_user,
);

// view all address verification accepted by a verification officer
router.get(
    '/agent/acceptedaddress/:agent_id',
    auth.staff_auth,
    staff_controller.get_all_verification_accepted_by_an_agent,
);

// view all address verification done by a verification officer
router.get(
    '/agent/address/:agent_id', ////////////////////////
    auth.staff_auth,
    staff_controller.get_all_ver_done_by_agent,
);

//view all accepted verification by an agent
router.get(
    '/acceptedverification/:id',
    auth.staff_auth,
    agent_controller.get_all_accepted_verification_by_all_agents,
);

//get all verifications per location
router.get(
    '/verificationlocation/:lga/:state',
    auth.staff_auth,
    staff_controller.get_all_verification_in_a_location,
);
router.get(
    '/agent',
    auth.staff_auth,
    staff_controller.get_all_verification_agents,
);
router.get(
    '/agent/:agent_id',
    auth.staff_auth,
    staff_controller.get_a_verification_agent,
);

module.exports = router;