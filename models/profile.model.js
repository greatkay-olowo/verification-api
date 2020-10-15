const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
      trim: true,
    },

    identityVerification: {
      type: Array,
    },

    physicalVerification: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const NIMVerificationSchema = mongoose.model(
  "NIMVerificationSchema",
  NIMVerificationSchema
);

module.exports = NIMVerificationSchema;
