const mongoose = require("mongoose");

const { Schema } = mongoose;

const crawlSchema = new Schema(
  {
    rawAttributes: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crawl", crawlSchema);
