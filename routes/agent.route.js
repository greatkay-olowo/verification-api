const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const agent_controller = require('../controller/agent.controller');
const auth = require('../utils/auth');
const agent_availability = require('../utils/agent_availability');

//create agent account
router.post(
	'/signup',
	// validate input
	[
		body('email').isEmail().trim(),
		body('password').isString().isLength({ min: 8 }).trim(),
		body('first_name').isString().trim().escape(),
		body('last_name').isString().trim().escape(),
		body('tel').isInt().trim().escape(),
		body('lga').isString().trim().escape(),
		body('state').isString().trim().escape(),
		body('gender').isString().trim().escape(),
		body('bvn').isInt().trim().isLength({ min: 11 }).escape(),
		body('acount_number').isInt().trim().escape(),
		body('account_name').isString().trim().escape(),
		body('bank_name').isString().trim().escape(),
	],
	agent_controller.create_agent_account,
);

// Login
router.post('/login', auth.agent_auth, agent_controller.login);

// accept business verification
//id is agent id, not verification id
router.put(
	'/acceptverification/:id',
	auth.agent_auth,
	agent_availability,
	agent_controller.accept_business_verification,
);

//view accepted verifications by an agent
router.get(
	'/acceptedverification/:id',
	auth.agent_auth,
	agent_availability,
	agent_controller.get_all_accepted_verification_by_an_agent,
);

//complete a business verification.
router.put(
	'/complete/:id',
	[
		body('status').isString().trim().escape(),
		body('user_id').isString().trim(),
		body('note').isString().trim().escape(),
		body('long').isFloat().trim().escape(),
		body('lang').isFloat().trim().escape(),
		body('completed_by').isString().trim().escape(),
		body('pictures').isArray(),
	],
	auth.agent_auth,
	agent_availability,
	agent_controller.compelete_a_verification,
);

//Get verification ordered from a location not get accepted by any agent and not get completed
router.get(
	'/verificationlocation/:lga/:state',
	auth.agent_auth,
	agent_availability,
	agent_controller.get_all_verification_in_a_location_not_accptd_by_any_agent,
);

module.exports = router;
