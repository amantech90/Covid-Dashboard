const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CovidSchema = new Schema(
  {
    countryName: {
      type: String,
      enum: ["india"],
      lowercase: true,
      unique: true
    },
    cases: [
      {
        caseObjectId: {
          type: Schema.Types.ObjectId,
          ref: "Case"
        }
      }
    ]
  },
  { timestamps: true }
);

const CovidCollection = mongoose.model("Covid", CovidSchema);

module.exports = CovidCollection;
