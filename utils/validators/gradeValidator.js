const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const Course = require("../../models/courseModel");
const Grade = require("../../models/gradeModel");

exports.createGradeValidator = [
  body("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid user id format")
    .custom((val, { req }) => {
      if (
        val.toString() !== req.user._id.toString() &&
        req.user.role === "user"
      ) {
        return Promise.reject(
          new Error("You are not allowed to access this route")
        );
      } else return true;
    }),
  body("course")
    .notEmpty()
    .withMessage("enter course id")
    .isMongoId()
    .withMessage("Invalid course id format")
    .custom((val, { req }) =>
      Course.findById(val).then((course) => {
        if (!req.body.user && !req.body.number) req.body.user = req.user._id;
        if (!course) {
          return Promise.reject(new Error("No course exist with this id"));
        } else return true;
      })
    ),
  body("number")
    .optional()
    .custom((val, { req }) =>
      User.findOne({ number: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error("No user exist with this number"));
        } else {
          req.body.user = user._id;
          req.body.username =  user.name;
          return true;
        }
      })
    ),
  body("course").custom((val, { req }) =>
    Grade.findOne({ user: req.body.user, course: val, target: req.query.target }).then((grade) => {
      if(!req.body.username) req.body.username = req.user.name;
      if (grade) {
        return Promise.reject(
          new Error("You already have your grade")
        );
      } else return true;
    })
  ),
  body("mark").notEmpty().withMessage("Enter student mark"),

  validatorMiddleware,
];

exports.getGradeValidator = [
  check("id").isMongoId().withMessage("Invalid grade id format"),
  validatorMiddleware,
];

exports.updateGradeValidator = [
  check("id").isMongoId().withMessage("Invalid grade id format"),
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

exports.deleteGradeValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid grade id format")
  ,
  validatorMiddleware,
];
