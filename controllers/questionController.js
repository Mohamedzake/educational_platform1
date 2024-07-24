const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const Question = require("../models/questionModel");

exports.getQuestions = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(Question.find(), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;

  const questions = await mongooseQuery;

  res.status(200).json({
    results: questions.length,
    // <<<<<<< HEAD
    //     data: questions,
    // =======
    data: questions,
    // >>>>>>> b3b36b794215c90d8be41ef05fd5671c940ba6a2
  });
});

exports.createQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const question = await Question.findById(id);
  if (!question) {
    return next(new ApiError(`No question exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  // <<<<<<< HEAD
  //   console.log(req.body);
  //   const question = await Question.findByIdAndUpdate(id, req.body, {
  //     new: true,
  //   });
  // =======
  const question = await Question.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // >>>>>>> b3b36b794215c90d8be41ef05fd5671c940ba6a2

  if (!question) {
    return next(new ApiError(`No question exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const question = await Question.findByIdAndDelete(id);
  if (!question) {
    return next(new ApiError(`No question exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
