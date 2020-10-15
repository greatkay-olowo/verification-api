const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const auth = require("./auth");

const authentication = (req, res, next) => {
  const userID = req.body.userID;
  const key = req.headers.authorization;
  // if (!req.headers.authorization) {
  //   return res.status(403).json({ error: "No keys sent!" });
  // }
  // User.findOne({ userID: userID }).then((user) => {
  //   if (bcrypt.compare(key, user.key)) {
  //     return next();
  //   } else {
  //     return res.status(403).json({ error: "Incorrect Keys!" });
  //   }
  // });
  return next(); //remove this to enable auth
};

module.exports = authentication;
