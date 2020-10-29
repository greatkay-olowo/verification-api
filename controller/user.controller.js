const Analytics = require("../models/analytics.model");
const Company_Data = require("../models/company_data.model");
const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const nanoid = require("nanoid");
const { validationResult } = require("express-validator");

const saltRounds = 10;

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  let { email, password, companyName, regNo, tel, address } = req.body;
  email = email.toLowerCase();

  User.find({ email })
    .then((user) => {
      if (user.length !== 0) {
        res
          .status(401)
          .json({ status: "failed", message: `${email} already taken.` });
      } else {
        bcrypt
          .hash(password, saltRounds)
          .then((hash) => {
            const key = nanoid(10);
            const newUser = new User({
              email,
              password: hash,
              companyName,
              regNo,
              key,
              tel,
              address,
              type: "customer",
              identity_price: "0",
              address_price: "0",
            });
            newUser
              .save()
              .then(() => {
                User.findOne({ email }).then((user) => {
                  const newAnalytics = new Analytics({
                    user_id: user._id,
                    transaction_history: [],
                    number_of_identity_verification: "",
                    identity_verification_price: "",
                    address_verification_price: "",
                    wallet: "0",
                  });
                  newAnalytics.save();
                  Company_Data.find()
                    .then((data) => {
                      data.number_of_customers += 1;
                      data.save();
                    })
                    .catch((err) => {
                      console.error(err);
                      res.status(400).json({
                        status: "failed",
                        message: "User registration not successful. ",
                      });
                    });
                });

                res
                  .status(202)
                  .json({ status: "success", message: "user registered" });
              })
              .catch((err) => {
                console.error(err);
                res.status(400).json({
                  status: "failed",
                  message: "User registration not successful. ",
                });
              });
          })
          .catch((err) => {
            console.error(err);
            res.status(400).json({
              status: "failed",
              message: "User registration not successful. ",
            });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        status: "failed",
        message: "User registration not successful. ",
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

  User.findOne({ email })
    .then((result) => {
      if (result.length === 0) {
        res
          .status(404)
          .json({ status: "failed", message: "Account not found." });
      } else {
        if (bcrypt.compare(password, result.password)) {
          Analytics.findOne({ _id: result._id })
            .then((analytic) => {
              res.status(202).json({
                status: "success",
                message: [
                  analytic.user_id,
                  result.key,
                  result.companyName,
                  result.regNo,
                  result.email,
                  result.tel,
                  analytic.number_of_identity_verification_ordered,
                  analytic.number_of_identity_verification_completed,
                  analytic.number_of_address_verification_ordered,
                  analytic.number_of_address_verification_completed,
                  analytic.wallet,
                ],
              });
            })
            .catch();
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

exports.changepassword = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }
  const { password, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      user.password = password;
      user
        .save()
        .then(() =>
          res
            .status(202)
            .json({ status: "success", message: "User update successfull" }),
        )
        .catch((err) => {
          console.error({ err });
          res.status(400).json({
            status: "failed",
            message: `Profile cannot be updated.`,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        status: "failed",
        message: `Password change not successful.`,
      });
    });
};

exports.generate_key = (req, res) => {
  const { user_id } = req.body;
  const key = nanoid(10);
  User.findById({ _id: user_id }).then((user) => {
    user.key = key;
    user
      .save()
      .then(() => {
        res.status(202).json({ status: "success", message: `${key}` });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({
          status: "failed",
          message: "User registration not successful. ",
        });
      });
  });
};
