const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      // required: [true, "User name required"],
    },
    email: {
      type: String,
      // required: [true, "User email required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // required: [true, "password must be included"],
    },
    year: {
      type: String,
      default: "general",
    },
    number: Number,
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },
    image: String,
  },
  { timestamps: true }
);

const setImage = (doc) => {
  const img = doc.image;
  if (img && !img.startsWith("h")) {
    const imageUrl = `${process.env.BASE_URL}/users/${img}`;
    doc.image = imageUrl;
  }
};

userSchema.post(["init", "save"], setImage);

module.exports = mongoose.model("User", userSchema);
