const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BVNVerificationSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },

    orderID: {
      type: String,
      required: true,
    },

    profileID: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      trim: true,
    },

    identityData: {
      type: Object,
      required: true,
    },

    dateCompleted: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BVNVerificationSchema = mongoose.model(
  "BVNVerificationSchema",
  BVNVerificationSchema
);

module.exports = BVNVerificationSchema;
