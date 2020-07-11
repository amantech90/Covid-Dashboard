const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CasesSchema = new Schema(
  {
    totalNoOfDeath: {
      type: Number,
      required: true
    },
    noOfRecovered: {
      type: Number,
      required: true
    },
    activeCases: {
      type: Number,
      required: true
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Covid"
    },
    stateName: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

const CasesCollection = mongoose.model("Case", CasesSchema);

module.exports = CasesCollection;
