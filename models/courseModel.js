const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Course name required"],
    },
    year: {
      type: String,
      trim: true,
    },
    image: String,
    instructor: String,
  },
  { timestamps: true }
);

const setImage = (doc) => {
  const img = doc.image;
  if (img && !img.startsWith('h')) {
    console.log(process.env.BASE_URL);
    const imageUrl = `${process.env.BASE_URL}/courses/${img}`;
    doc.image = imageUrl;
  }
};

courseSchema.post(["init", "save"], setImage);

module.exports = mongoose.model("Course", courseSchema);
