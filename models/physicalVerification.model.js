const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const physicalVerificationSchema = new Schema(
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

    address: {
      type: String,
      required: true,
      trim: true,
    },

    lga: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    informAboutVisit: {
      type: Boolean,
      required: true,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    },

    pictures: {
      type: Array,
      required: true,
      trim: true,
    },

    long: {
      type: String,
      required: true,
      trim: true,
    },

    lang: {
      type: String,
      required: true,
      trim: true,
    },

    dateRequested: {
      type: String,
      required: true,
    },

    dateCompleted: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const physicalVerification = mongoose.model(
  "physicalVerification",
  physicalVerificationSchema
);

module.exports = physicalVerification;
