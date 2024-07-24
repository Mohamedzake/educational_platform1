const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadfilesMiddlewares");
const User = require("../models/userModel");

exports.uploadUserImage = uploadSingleImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${imageName}`);
    req.body.image = imageName;
  }
  next();
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(User.find(), req.query);
  apiFeatures.filter().sort().limitFields().search("User");
  const { mongooseQuery } = apiFeatures;
  const users = await mongooseQuery;

  res.status(200).json({
    results: users.length,
    data: { users },
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email });
  if (user) {
    return next(new ApiError("E-mail already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  req.body.password = hashedPassword;

  user = await User.create(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: {
      user,
    },
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // <<<<<<< HEAD
  //   // <<<<<<< HEAD
  //   //   // <<<<<<< HEAD
  //   //   //   console.log(req.body.image);
  //   //   //   console.log(id);
  //   //   // =======

  //   //   // <<<<<<< HEAD
  //   //   //   // <<<<<<< HEAD
  //   //   //   //   // >>>>>>> 5b2411800c6bc434d112f7924f3f3a014b6cad1f
  //   //   //   //   const user = await User.findByIdAndUpdate(
  //   //   //   //     id,
  //   //   //   //     {
  //   //   //   //       name: req.body.name,
  //   //   //   //       email: req.body.email,
  //   //   //   //       year: req.body.year,
  //   //   //   //       image: req.body.image,
  //   //   //   //       number: req.body.number,
  //   //   //   //     },
  //   //   //   //     { new: true }
  //   //   //   //   );
  //   //   //   // =======
  //   //   //   const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  //   //   //   // >>>>>>> 257fb0f6cf4a1f40e95aa0a219332a708cc750cb
  //   //   // =======
  //   // =======
  //   let pass;
  //   if (req.body.password) pass = await bcrypt.hash(req.body.password, 12);
  //   // >>>>>>> f7c40f4cf05dbadb0ce79a83a0e43506d753e37a
  // =======
  // >>>>>>> c7319cbe3e22747deab86ecc13572d838bf8991f
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      year: req.body.year,
      image: req.body.image,
      number: req.body.number,
      // <<<<<<< HEAD
      //       // <<<<<<< HEAD
      //       //       password: await bcrypt.hash(req.body.password, 12),
      //       // =======
      //       password: pass,
      //       // >>>>>>> f7c40f4cf05dbadb0ce79a83a0e43506d753e37a
      //     },
      //     { new: true }
      //   );
      //   // >>>>>>> 100722277de7b31cdf01f0f3c1e3c2cc6ba7c5de

      // =======
    },
    { new: true }
  );
  if (req.body.password)
    user.password = await bcrypt.hash(req.body.password, 12);
  await user.save();
  // >>>>>>> c7319cbe3e22747deab86ecc13572d838bf8991f
  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

// <<<<<<< HEAD
// exports.updateUserPassword = asyncHandler(async (req, res, next) => {
//      const { id } = req.params;

//      const user =
// });
// =======
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    { new: true }
  );
  if (!user) {
    return next(new APIError(`no user with this id ${req.params.id}`, 404));
  }
  return res.status(200).json({
    message: "User updated successfully",
    data: {
      user,
    },
  });
});
// >>>>>>> fad6e82887c5ea456e4c2f68ee295ffea887269e

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    message: "User deleted successfully",
  });
});

exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  console.log(1);
  req.params.id = req.user._id;
  console.log(2);
  next();
});

exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
