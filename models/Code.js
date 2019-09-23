const mongoose = require("mongoose");

const { Schema } = mongoose;

const codeSchema = new Schema(
  {
    generatedCode: {
      type: String,
      required: true
    },
    retrievalCode: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Code", codeSchema);
