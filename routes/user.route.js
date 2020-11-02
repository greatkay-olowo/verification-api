const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const user_controller = require("../controller/user.controller");
const auth = require("../utils/customer_auth");

//signup
router.post(
    "/signup",
    // validate input
    [
        body("email").isEmail().trim(),
        body("password").isString().isLength({ min: 8 }).trim(),
        body("companyName").isString().trim().escape(),
        body("regNo").isString().trim().escape(),
        body("tel").isString().trim().escape(),
        body("address").isString().trim().escape(),
    ],
    user_controller.signup,
);

// Login
router.post(
    "/login", [body("email").isEmail().trim(), body("password").isString().trim().escape()],
    user_controller.login,
);

//change password
router.put(
    "/changepassword", [body("email").isEmail().trim(), body("password").isString().trim().escape()],
    auth,
    user_controller.changepassword,
);

//generate a new key
router.put("/generatekey", auth, user_controller.generate_key);
module.exports = router;