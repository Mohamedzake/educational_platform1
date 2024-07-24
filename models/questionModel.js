const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: {
      type: String,
      trim: true,
      // required: [true, "User name required"],
    },
    options: {
      type: [String],
      // required: [true, "User name required"],
    },
    correctOption: {
      type: Number,
      // required: [true, "User name required"],
    },
    points: {
      type: Number,
      // required: [true, "User name required"],
    },
    target : String,
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
