const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Course = require("../../models/courseModel");
const Type = require("../../models/typeModel");

exports.createTypeValidator = [
  body("course")
    .isMongoId()
    .withMessage("Invalid type id format")
    .custom((val, { req }) =>
      Course.findById(val).then((course) => {
        if (!course)
          return Promise.reject(new Error("No course exist with this id"));

        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  validatorMiddleware,
];

exports.getTypeValidator = [
  check("id").isMongoId().withMessage("Invalid material id format"),

  validatorMiddleware,
];

exports.updateMaterialValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid type id format")
    .custom((val, { req }) =>
      Type.findById(val).then(async (type) => {
        const mId = type.course.toString();
        const course = await Course.findById(mId);
        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  validatorMiddleware,
];

exports.deleteMaterialValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid type id format")
    .custom((val, { req }) =>
      Type.findById(val).then(async (type) => {
        const mId = type.course.toString();
        const course = await Course.findById(mId);
        if (
          req.user.role === "instructor" &&
          course.instructor !== req.user.name
        )
          return Promise.reject(
            new Error("you are not allowed to access this route")
          );
      })
    ),
  validatorMiddleware,
];
