const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    mark: {
      type: String,
      // required: [true, "User name required"],
    },

    target: {
      type: String,
      // required: [true, "User name required"],
    },
    username: String,
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grade", gradeSchema);
