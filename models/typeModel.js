const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeSchema = new Schema(
  {
    type: {
      type: String,
      // required: [true, "Enter file type"],
    },
    materials: [
      {
        file: String,
        id: String,
        name: String,
        user:String,
      },
    ],
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Type", typeSchema);
