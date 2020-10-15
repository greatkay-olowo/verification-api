const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const auth = require("../utils/auth");

const saltRounds = 10;

//signup
router.post("/signup", auth, (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  User.find({ email: email })
    .then((user) => {
      if (user.length !== 0) {
        res
          .status(401)
          .json({ status: "failed", message: `${email} already taken.` });
      } else {
        bcrypt
          .hash(password, saltRounds)
          .then((hash) => {
            const newUser = new User({
              email,
              password: hash,
            });
            newUser
              .save()
              .then(() => {
                User.findOne({ email: email }).then((user) => {
                  const newReport = new Report({
                    userId: user._id,
                    customers: 0,
                    pendingApplications: {
                      number: 0,
                      amount: 0,
                    },
                    savingBalance: {
                      number: 0,
                      amount: 0,
                    },
                    loanBalance: {
                      number: 0,
                      amount: 0,
                    },
                    saving: [],
                    disbursement: [],
                    repayment: [],
                  });
                  newReport.save();
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
});

// Login
router.post("/login", (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  User.find({ email: email })
    .then((result) => {
      if (result.length === 0) {
        res
          .status(404)
          .json({ status: "failed", message: "Account not found." });
      } else {
        if (bcrypt.compare(password, result[0].password)) {
          res.status(202).json({
            status: "success",
            message: { user: result[0].email, userId: result[0]._id },
          });
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
});

//change password
router.post("/changepassword/:id", (req, res) => {
  const email = req.params.id;
  const { password } = req.body;
  User.find({ email: email })
    .then((user) => {
      user[0].password = password;
      user[0]
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
      res
        .status(400)
        .json({ status: "failed", message: `Password change not successful.` });
    });
});
module.exports = router;
