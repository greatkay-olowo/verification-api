// Or any other http client library
const axios = require("axios");
const moment = require("moment");
const cryptojs = require("crypto-js");

const baseUrl = `https://carbonivs.co`;
const merchantId = "YOUR_MERCHANT_ID";
const apiKey = "YOUR_API_KEY";

const carbon = async(requestObject) => {
    // If Request doesnt require a body e.g GET Requests
    // then requestRawBody = "";

    const requestRawBody = JSON.stringify(requestObject);
    // Format Sun, 25 Mar 2019 10:21:49 GMT
    let dateHeaderValue = moment()
        .utcOffset("+0000")
        .format("ddd, DD MMM YYYY HH:mm:ss G\\MT");

    let bodyDigest = cryptojs
        .SHA256(requestRawBody)
        .toString(cryptojs.enc.Base64);
    let digestHeaderValue = `SHA-256=${bodyDigest}`;

    // `${REQUEST_METHOD} ${REQUEST_PATH} HTTP/1.1`
    let requestLine = `POST /api/v2/transfers/sendmoney HTTP/1.1`;

    let signingString = [
        `date: ${dateHeaderValue}`,
        `digest: ${digestHeaderValue}`,
        `host: ${url.parse(baseUrl).hostname}`,
        requestLine,
    ].join("\n");

    let signature = cryptojs
        .HmacSHA256(signingString, apiKey)
        .toString(cryptojs.enc.Base64);

    let hMACAuth = `hmac ${merchantId}:${signature}`;

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Date: dateHeaderValue,
        Digest: digestHeaderValue,
        Authorization: hMACAuth,
    };

    const transferUrl = `${baseUrl}/api/verify`;
    const data = await axios.post(transferUrl, requestObject, { headers });

    const result = cryptojs.AES.decrypt(data, apiKey);

    return result;
};

module.exports = carbon;