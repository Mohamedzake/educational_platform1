const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const Grade = require("../models/gradeModel");

exports.getGrades = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(Grade.find(), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;

  // <<<<<<< HEAD
  //   // <<<<<<< HEAD
  //   //   const grade = await mongooseQuery.populate({
  //   //     path: "user course",
  //   //     select: "name",
  //   //   });
  //   // =======
  //   const grade = await mongooseQuery.populate({
  //     path: "user course",
  //     select: "name number",
  //   });
  //   // >>>>>>> 2aea401b59b10488d4964c44402b210a436f333f
  // =======
  let grades = await mongooseQuery.populate({
    path: "user course",
    select: "name number",
  });

  if (req.user.role === "user") {
    const newGrade = [];
    grades.forEach((grade) => {
      if (grade.user._id.toString() === req.user._id.toString()) {
        newGrade.push(grade);
        return;
      }
    });
    grades = newGrade;
  }
  // >>>>>>> 1958bfdfb1e632f924ea2b3425ef65476319e87b

  res.status(200).json({
    results: grades.length,
    data: grades,
  });
});

exports.createGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.create(req.body);
  // <<<<<<< HEAD
  //   console.log(req.body);
  // =======
  // >>>>>>> a6cd63560d7da5d1baaed5f590da53f5ee9c611c
  res.status(201).json({
    status: "success",
    data: {
      grade,
    },
  });
});

exports.getGrade = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const grade = await Grade.findById(id);
  if (!grade) {
    return next(new ApiError(`No grade exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      grade,
    },
  });
});

exports.updateGrade = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const grade = await Grade.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!grade) {
    return next(new ApiError(`No grade exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      grade,
    },
  });
});

exports.deleteGrade = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const grade = await Grade.findByIdAndDelete(id);
  if (!grade) {
    return next(new ApiError(`No grade exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
