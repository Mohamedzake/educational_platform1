const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const {
  uploadSingleImage,
} = require("../middlewares/uploadfilesMiddlewares");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const Course = require("../models/courseModel");

exports.uploadCourseImage = uploadSingleImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageName = `course-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/courses/${imageName}`);
    req.body.image = imageName;
  }
  next();
});

exports.getCourses = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) filter = req.filterObj;
  const apiFeatures = new ApiFeatures(Course.find(filter), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;

  const courses = await mongooseQuery;

  res.status(200).json({
    results: courses.length,
    data: { courses },
  });
});

exports.createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  if (!course) {
    return next(new ApiError(`No course exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const course = await Course.findByIdAndUpdate(id, req.body, { new: true });

  if (!course) {
    return next(new ApiError(`No course exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    return next(new ApiError(`No course exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
