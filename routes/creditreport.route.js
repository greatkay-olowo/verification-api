const express = require("express");
const router = express.Router();
const cryptojs = require("crypto-js");

const identity = require("../models/identity.model");

const carbon = require("../helper/carbon");

//get an identity report
router.get("/identity/:orderID", (req, res) => {
  const key = req.headers.authorization;

  // type can be bvn, driverlicence, passport, voterid, nationalid, nimcslip, cac or tin
  // If you are verifying bvn, tin or cac then only the identification_number is required.

  const {
    identification_first_name,
    identification_type,
    identification_last_name,
    identification_middle_name,
    identification_bvn,
    identification_dob,
    identification_phone_numbers,
  } = req.body;

  // Type of verification must be set to credit
  // middle name is optional

  const requestObject = {
    identification_type: "credit",
    identification_first_name: "Lekan",
    identification_last_name: "David",
    identification_middle_name: "",
    identification_bvn: "12345678901",
    identification_dob: "1956-04-08",
    identification_phone_numbers: ["0803xxxxxxx", "0908xxxxxxx"],
  };

  // Sample Payload to encrypt
  //   {
  //     "identification_type": "credit"
  //     "identification_first_name": "Lekan",
  //     "identification_last_name": "David",
  //     "identification_middle_name": "",
  //     "identification_bvn": "12345678901",
  //     "identification_dob": "1956-04-08",
  //     "identification_phone_numbers": ["0803xxxxxxx", "0908xxxxxxx"]
  // }

  const data = carbon(requestObject, "https://carbonivs.co/api/verify");

  res.status().json({ data });
});

module.exports = router;
