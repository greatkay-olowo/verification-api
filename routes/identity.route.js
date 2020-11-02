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
        identification_type,
        identification_number,
        identification_name,
        identification_dob,
        user_id,
    } = req.body;

    const requestObject = {
        identification_type,
        identification_number,
        identification_name,
        identification_dob,
    };
    // Sample Payload to encrypt
    //    {
    //     "identification_type": "type",
    //     "identification_number": "A12345678",
    //     "identification_name": "Lekan David",
    //     "identification_dob": "1960-09-01"
    // }

    const data = carbon(requestObject);
    const res = cryptojs.AES.decrypt(data, key);

    res.status().json({ res });
});

module.exports = router;