const mongoose = require("mongoose");
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const identity_schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    user_id: { type: String, required: true },
    status: { type: String, required: true },
    identity_data: { type: Array, required: true },
    date_completed: { type: String, required: true },
  },
  { timestamps: true },
);

const Identity = mongoose.model("identity_schema", identity_schema);

module.exports = Identity;
