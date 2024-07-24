const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const Schedule = require("../models/scheduleModel");

exports.getSchedules = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(Schedule.find(), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;

  const schedule = await mongooseQuery;

  res.status(200).json({
    results: schedule.length,
    data: schedule,
  });
});

exports.createSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.getSchedule = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const schedule = await Schedule.findById(id);
  if (!schedule) {
    return next(new ApiError(`No schedule exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.updateSchedule = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const schedule = await Schedule.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!schedule) {
    return next(new ApiError(`No schedule exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const schedule = await Schedule.findByIdAndDelete(id);
  if (!schedule) {
    return next(new ApiError(`No schedule exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
