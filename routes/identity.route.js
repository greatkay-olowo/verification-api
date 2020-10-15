const express = require("express");
const router = express.Router();

const identity = require("../models/identity.model");

const BVN = require("../helper/BVN");
const NIM = require("../helper/NIM");

//get an identity report
router.get("/identity/:orderID", (req, res) => {
  const { BVN, NIM, firstName, lastName, DOB } = req.body;

  if (
    BVN === undefined &&
    NIM === undefined &&
    (firstName === undefined || lastName === undefined || DOB === undefined)
  ) {
    res.status(400).json({ status: "failed", data: "" });
  }

  let data;

  if (BVN !== indefined) {
    data = BVN(BVN, firstName, lastName, DOB);
  }

  if (NIM !== indefined) {
    data = NIM(BVN, firstName, lastName, DOB);
  }

  res.status(202).json({ status: "successful", data });
});

module.exports = router;
