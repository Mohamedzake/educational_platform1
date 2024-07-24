const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Course = require("../../models/courseModel");
const Schedule = require("../../models/scheduleModel");

exports.createScheduleValidator = [
  body("course")
    .notEmpty()
    .withMessage("enter course id")
    .isMongoId()
    .withMessage("Invalid course id format")
    .custom((val) =>
      Course.findById(val).then((course) => {
        if (!course) {
          return Promise.reject(new Error("No course exist with this id"));
        }
      })
    ),
  body("course").custom((val) =>
    Schedule.findOne({ course: val }).then((schedule) => {
      console.log(schedule);
      if (schedule) {
        return Promise.reject(
          new Error("There are already schedule time for this course")
        );
      } else return true;
    })
  ),

  validatorMiddleware,
];

exports.getScheduleValidator = [
  check("id").isMongoId().withMessage("Invalid schedule id format"),
  validatorMiddleware,
];

exports.updateScheduleValidator = [
  check("id").isMongoId().withMessage("Invalid schedule id format"),
  body("course")
    .optional()
    .isMongoId()
    .withMessage("Invalid course id format")
    .custom((val, { req }) =>
      Course.findOne({ _id: val }).then((course) => {
        if (!course) {
          return Promise.reject(new Error("This course is not exist"));
        } else return true;
      })
    ),
  validatorMiddleware,
];

exports.deletescheduleValidator = [
  check("id").isMongoId().withMessage("Invalid schedule id format"),
  validatorMiddleware,
];
