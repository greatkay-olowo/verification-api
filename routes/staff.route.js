const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const staff_controller = require("../controller/staff.controller");
const auth = require("../utils/others_auth");

router.get("/customers", auth, staff_controller.get_all_customers);

router.get("/customer/:id", auth, staff_controller.get_a_customer);

router.put(
  "/editcustomer/:id",
  [
    body("email").isEmail().trim(),
    body("companyName").isString().trim().escape(),
    body("regNo").isString().trim().escape(),
    body("tel").isString().trim().escape(),
    body("address").isString().trim().escape(),
    body("identity_price").isString().trim().escape(),
    body("address_price").isString().trim().escape(),
  ],
  auth,
  staff_controller.update_customer_profile,
);

// get all address verification related to a profile
router.get(
  "/customerprofile/:identity_id",
  auth,
  staff_controller.get_all_prof_ver,
);

// view address verification done by a verification officer
router.get(
  "/verificationagent/:id",
  auth,
  staff_controller.get_all_ver_done_by_agent,
);

router.get(
  "/verificationlocation/:lga/:state",
  auth,
  staff_controller.get_all_ver_done_by_agent,
);

router.get("/agent", auth, staff_controller.get_all_verification_agents);

module.exports = router;
